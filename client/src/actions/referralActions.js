import axios from 'axios';
import {BASE_URL} from '../utils/constants';
import {
    LOAD_REFERRAL_DATA, REFERRAL_DATA_IS_LOADING
} from './types';

export const loadReferralData = () => dispatch =>{
    dispatch(referralDataIsLoadingCreator(true));
    axios
        .get(BASE_URL+'/api/referrals/referralInfo')
        .then(res => {
            console.log(res.data);
            dispatch(loadReferralDataCreator(res.data));
            dispatch(referralDataIsLoadingCreator(false));
        })
        .catch(err =>
            {
                console.log("Error: " + err);
                dispatch(referralDataIsLoadingCreator(false));
            }
        );
};
export const loadReferralDataCreator = ({sponsor, referralBonusEarned, levelOneReferrals,levelTwoReferrals,levelThreeReferrals}) => {
    return {
        type: LOAD_REFERRAL_DATA,
        payload: {
            sponsor: sponsor, 
            referralBonusEarned:referralBonusEarned,
            levelOneReferrals: levelOneReferrals,
            levelTwoReferrals: levelTwoReferrals,
            levelThreeReferrals: levelThreeReferrals
        }
    };
};

export const referralDataIsLoadingCreator = (isLoading) => {
    return {
        type: REFERRAL_DATA_IS_LOADING,
        payload: {
            isLoading: isLoading
        }
    };
};