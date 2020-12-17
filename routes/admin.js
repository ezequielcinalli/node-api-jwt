const router = require('express').Router();

router.get('/', (req, res) => {
    res.json({
        error: null,
        data: {
            title: 'Admin route protected with middleware',
            user: req.user
        }
    })
})

module.exports = router