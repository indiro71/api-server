const { Router } = require('express');
const router = Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../keys');
const User = require('../../models/User');

router.post('/', (req, res) => {
    const { email, password } = req.body;

    User.findOne({ email }).then(user => {
        if (!user) {
            return res.status(401).json({ message: 'Email not found' });
        }

        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                const payload = {
                    id: user.id,
                    name: user.name
                };

                jwt.sign(
                    payload,
                    keys.SESSION_SECRET,
                    {
                        expiresIn: 31556926
                    },
                    (err, token) => {
                        res.json({
                            success: true,
                            token: 'Bearer ' + token,
                            message: `Wellcome ${payload.name}`
                        });
                    }
                );
            } else {
                return res
                    .status(400)
                    .json({ message: 'Password incorrect' });
            }
        });
    });
});

module.exports = router;