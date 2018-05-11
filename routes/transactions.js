var express = require('express');
var router = express.Router();
var Transaction = require('../models/Transaction');
var Account = require('../models/Account');
var auth = require('../middlewares/auth');

var ibanExist = function (req, res, next) {
    Account.findOne({ iban: req.body.account2 }, function (err, account) {
        if (err) return res.status(500).json({ message: err })
        if (!account) return res.status(404).json({ message: 'Iban not Found' })
        req.accountB = account;
        next();
    })
}


var moneyExist = function (req, res, next) {
    if (req.user.credit < req.body.amount) {
        console.log(req.user.credit);
        console.log(req.body.amount);
        
        
        return res.status(409).json({ message: 'No money' })
    } else {
        next();
    }
}
router.post('/', auth.verify, ibanExist, moneyExist, function (req, res) {
    var transaction = new Transaction();
    transaction.account1 = req.user.iban;
    transaction.account2 = req.accountB.iban;
    transaction.amount = req.body.amount;
 /*   console.log(req.user);
    console.log(req.accountB);
    console.log({"1":req.user.credit});
    console.log({"2":req.accountB.credit});
    console.log(req.body.amount);*/
    req.user.credit -= req.body.amount;
    req.accountB.credit += req.body.amount;
    /*console.log({"1":req.user.credit});
    console.log({"2":req.accountB.credit});*/
    transaction.save(function (err, transactionSuccess) {
        //console.log({"Tran":transactionSuccess});
        req.user.transaction.push(transactionSuccess)
        req.accountB.transaction.push(transactionSuccess)
        if (err) return res.status(500).json(err);
        req.user.save(function (err, user1Pay) {
            //console.log({"user1":user1Pay});
            if (err) return res.status(500).json(err);
            req.accountB.save(function (err, user2Pay) {
                //console.log({"user2":user2Pay});
                if (err) return res.status(500).json(err);
                res.status(201).json(transactionSuccess);
            })
        })
    })
})


module.exports = router;
