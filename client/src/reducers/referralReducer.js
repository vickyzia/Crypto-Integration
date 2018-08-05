import {
    REFERRAL_DATA_IS_LOADING,
    LOAD_REFERRAL_DATA
} from '../actions/types';
import isEmpty from '../validations/is-empty';

const initialState = {
    sponsor: '', 
    refcode: '',
    referralBonusEarned:0,
    levelOneReferrals: 0,
    levelTwoReferrals: 0,
    levelThreeReferrals: 0,
    isLoading: false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case LOAD_REFERRAL_DATA:
            return {
                ...state,
                sponsor: action.payload.sponsor, 
                refcode: action.payload.refcode,
                referralBonusEarned:action.payload.referralBonusEarned,
                levelOneReferrals: action.payload.levelOneReferrals,
                levelTwoReferrals: action.payload.levelTwoReferrals,
                levelThreeReferrals: action.payload.levelThreeReferrals
            };
        case REFERRAL_DATA_IS_LOADING:
            return {
                ...state,
                isLoading: action.payload.isLoading
            }
        default:
            return state;
    }
}