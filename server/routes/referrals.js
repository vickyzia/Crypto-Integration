const express = require("express");
const router = express.Router();
const Payout = require('../models/Payout');
const User = require('../models/User');
const validateToken = require('../validation/verify-token');
const payoutTypes = require('../config/payout-types');

router.get('/referralInfo',validateToken,(req,res)=>{
    var data = req.body;
    let errors = {};
    User.findOne({email: data.email}).then(user => {
        let sponsor = user.sponsor;
        Payout.aggregate([
            {$match: {_userId: user._id, payoutType: {$in : 
                [   payoutTypes.ReferralLevelOne,
                    payoutTypes.ReferralLevelTwo,
                    payoutTypes.ReferralLevelThree 
                ]}}},
            {$group:{ _id:user._id, total: { $sum: "$tokens" } } }
        ], function(err,payouts){
            if(err){
                console.log(err);
                errors.message = err;
                res.status(500).json(errors);
            }
            else{
                var referralBonusEarned = 0;
                if(payouts.length >0){
                    referralBonusEarned = payouts[0].total;
                }
                User.find({sponsor: user.refcode},{refcode:true}).then(ref1=>{
                    if(!ref1 || ref1.length == 0){
                        return res.status(200).json(getReferralResult(sponsor,referralBonusEarned,0,0,0,user.refcode));
                    }
                    let levelOneReferralCodes = ref1.map( r=> r.refcode);
                    User.find({sponsor: { $in : levelOneReferralCodes}},{refcode:true}).then(ref2 =>{
                        if(!ref2 || ref2.length == 0){
                            return res.status(200).json(getReferralResult(sponsor,referralBonusEarned,ref1.length,0,0,user.refcode));
                        }
                        let levelTwoReferralCodes = ref2.map( r=> r.refcode);
                        User.find({sponsor: { $in : levelTwoReferralCodes}},{refcode:true}).then(ref3 =>{
                            return res.status(200).json(getReferralResult(sponsor,referralBonusEarned,ref1.length,ref2.length,ref3.length,user.refcode));
                        }).catch(err=>{
                            console.log(err);
                            errors.message = err;
                            res.status(500).json(errors);
                        });
                    }).catch(err=>{
                        console.log(err);
                        errors.message = err;
                        res.status(500).json(errors);
                    });
                }).catch(err=>{
                    console.log(err);
                    errors.message = err;
                    res.status(500).json(errors);
                });
            }
        });
    }).catch(err =>{
        console.log(err);
        errors.message = err;
        res.status(500).json(errors);
    });
});

function getReferralResult(sponsor,referralBonusEarned,levelOneReferrals,levelTwoReferrals,levelThreeReferrals,refcode){
    return {
        sponsor: sponsor, 
        refcode: refcode,
        referralBonusEarned:referralBonusEarned,
        levelOneReferrals: levelOneReferrals,
        levelTwoReferrals: levelTwoReferrals,
        levelThreeReferrals: levelThreeReferrals
    }
}
module.exports = router;