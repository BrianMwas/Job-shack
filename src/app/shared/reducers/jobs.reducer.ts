import { createReducer, on, Action } from "@ngrx/store";
import * as JobActions from '../actions/joblist.actions';
import { Job } from '../models/job';

export const initialState: JobsState = {
    jobs: [],
    loading: false,
    error: undefined
};

export const singleJobInitialState: SingleJobState = {
    job: null,
    loading: false,
    error: undefined
}

export interface JobsState {
    jobs: Job[],
    loading: boolean,
    error: Error
} 

export interface SingleJobState {
    job: Job,
    loading: boolean,
    error: string
}


const _jobsReducer = createReducer(
    initialState,
    on(JobActions.AllJobs, (state, { payload }) => ({ ...state, jobs: payload, loading: false, error: null })),
    on(JobActions.AllJobsLoading, state => ({ ...state, loading: true, error: null}))
)


const _singleJobReducer = createReducer(
    singleJobInitialState,
    on()
    );


export function reducer(state: JobsState | undefined, action: Action) {
    return _jobsReducer(state, action);
}