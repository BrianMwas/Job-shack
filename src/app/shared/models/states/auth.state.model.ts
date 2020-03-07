import { User } from '../user';
import { Profile } from '../profile';

export interface AuthUserState {
    user: User[],
    loading: boolean,
    error: Error
} 

export interface ProfileState {
    userProfile: Profile,
    loading: boolean,
    error: string
}