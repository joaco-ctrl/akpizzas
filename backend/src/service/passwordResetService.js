const crypto = require('crypto');
const conexion = require('../config/database');

function createPasswordResetToken(email, callback) {
    conexion.query(
        'SELECT id, email FROM usuarios WHERE email = ? AND activo = 1 LIMIT 1',
        [email],
        (error, usuarios) => {
            if (error) return callback(error);
            if (!usuarios.length) return callback(null, null);

            const token = crypto.randomBytes(32).toString('hex');
            const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
            conexion.query(
                'DELETE FROM password_reset_tokens WHERE expires_at <= NOW()',
                deleteError => {
                    if (deleteError) return callback(deleteError);
                    conexion.query(
                        `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
                         VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 15 MINUTE))`,
                        [usuarios[0].id, tokenHash],
                        insertError => {
                            if (insertError) return callback(insertError);
                            callback(null, { email: usuarios[0].email, token, tokenHash });
                        }
                    );
                }
            );
        }
    );
}

function invalidatePasswordResetToken(tokenHash, callback) {
    conexion.query(
        'DELETE FROM password_reset_tokens WHERE token_hash = ?',
        [tokenHash],
        callback
    );
}

function resetPassword(token, passwordHash, callback) {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    conexion.getConnection((connectionError, connection) => {
        if (connectionError) return callback(connectionError);

        connection.beginTransaction(transactionError => {
            if (transactionError) {
                connection.release();
                return callback(transactionError);
            }

            const finish = (error, result) => {
                connection.release();
                callback(error, result);
            };
            const rollback = (error, result) => {
                connection.rollback(rollbackError => finish(error || rollbackError, result));
            };

            connection.query(
                `SELECT user_id FROM password_reset_tokens
                 WHERE token_hash = ? AND expires_at > NOW() AND used_at IS NULL
                 LIMIT 1 FOR UPDATE`,
                [tokenHash],
                (lookupError, tokens) => {
                    if (lookupError) return rollback(lookupError);
                    if (!tokens.length) return rollback(null, false);

                    const userId = tokens[0].user_id;
                    connection.query(
                        'UPDATE usuarios SET password = ? WHERE id = ? AND activo = 1',
                        [passwordHash, userId],
                        (updateError, result) => {
                            if (updateError) return rollback(updateError);
                            if (result.affectedRows !== 1) return rollback(null, false);

                            connection.query(
                                `UPDATE password_reset_tokens SET used_at = NOW()
                                 WHERE user_id = ? AND used_at IS NULL`,
                                [userId],
                                tokenError => {
                                    if (tokenError) return rollback(tokenError);
                                    connection.commit(commitError => {
                                        if (commitError) return rollback(commitError);
                                        finish(null, true);
                                    });
                                }
                            );
                        }
                    );
                }
            );
        });
    });
}

module.exports = {
    createPasswordResetToken,
    invalidatePasswordResetToken,
    resetPassword
};
