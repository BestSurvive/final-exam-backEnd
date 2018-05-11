var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var jwt = require('jwt-simple');
var Account = require('../models/Account');
var Transaction = require('../models/Transaction');
var auth = require('../middlewares/auth');


router.post('/signup', function (req, res) {
    var user = new Account();
    user.name = req.body.name;
    user.surname = req.body.surname;
    user.password = bcrypt.hashSync(req.body.password, 10);
    user.email = req.body.email;
    user.iban = req.body.iban;
    user.save(function (err, userCreated) {
        if (err) return res.status(400).json(err);
        res.status(201).json(userCreated);
    })
})

router.post('/login', function (req, res) {
    Account.findOne({ email: req.body.email }, function (err, user) {
        if (err) return res.status(500).json({ Error: err })
        if (!user) return res.status(404).json({ message: 'User not found' })
        if (bcrypt.compareSync(req.body.password, user.password)) {
            var token = jwt.encode(user._id, auth.secret);
            return res.json({ token: token });
        } else {
            return res.status(401).json({ message: 'Password not valid' });
        }

    })

})

router.get('/me', auth.verify, function (req, res, next) {
    res.json(req.user);
})
router.get('/', function (req, res, next) {
    Account.find({}, function (err, users) {
        res.json(req.users);
    })
})

router.get('/allTransactions', auth.verify, function (req, res, next) {
    //console.log(req.query.sent);
   //console.log(req.query.allBy);
    console.log(req.query.rec);
    console.log(req.user.iban);
    
    
    Account.findById(req.user._id).populate('transaction')
        .exec(function (err, user) {
            if (err) return res.status(500).json({ Error: err })
            if (!user) return res.status(404).json({ message: 'User not found' })
            if (req.query.allBy === req.user.iban) 
            {
                Transaction.find().exec((err,transaction)=>{
                    if (err) return res.status(500).json({ Error: err })
                    if (!transaction) return res.status(404).json({ message: 'Transaction not found' })
                    return res.json(transaction)
                })
            }




            //Non funziona
            if (req.query.sent === req.user.iban) 
            {
                Transaction.find({}, (err,transaction)=>{
                    if (err) return res.status(500).json({ Error: err })
                    if (!transaction) return res.status(404).json({ message: 'Transaction not found' })
                    if (req.user.iban===transaction.account1) return res.json(transaction)
                    return res.json( "No transactions")
                   
                })
            }
            //Non Funziona
            if (req.query.rec === req.user.iban) 
            {
                Transaction.find({}, (err,transaction)=>{
                    if (err) return res.status(500).json({ Error: err })
                    if (!transaction) return res.status(404).json({ message: 'Transaction not found' })
                    if (req.user.iban===transaction.account2) return res.json(transaction)
                    return res.json( "No transactions")
                   
                })
            }
           
        })
})


module.exports = router;
