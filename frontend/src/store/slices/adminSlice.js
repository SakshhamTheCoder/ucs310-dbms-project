import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Async thunks for fetching admin data
export const fetchGates = createAsyncThunk('admin/fetchGates', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/gates');
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch gates');
    }
});

export const fetchLounges = createAsyncThunk('admin/fetchLounges', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/lounges');
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch lounges');
    }
});

export const fetchNotifications = createAsyncThunk('admin/fetchNotifications', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/notifications/all');
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications');
    }
});

export const fetchPayments = createAsyncThunk('admin/fetchPayments', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/payments/all');
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch payments');
    }
});

export const addLounge = createAsyncThunk('admin/addLounge', async (loungeData, { rejectWithValue }) => {
    try {
        const response = await api.post('/lounges/add', loungeData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to add lounge');
    }
});

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        gates: [],
        lounges: [],
        notifications: [],
        payments: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchGates.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGates.fulfilled, (state, action) => {
                state.loading = false;
                state.gates = action.payload;
            })
            .addCase(fetchGates.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchLounges.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLounges.fulfilled, (state, action) => {
                state.loading = false;
                state.lounges = action.payload;
            })
            .addCase(fetchLounges.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications = action.payload;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchPayments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPayments.fulfilled, (state, action) => {
                state.loading = false;
                state.payments = action.payload;
            })
            .addCase(fetchPayments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addLounge.fulfilled, (state, action) => {
                state.lounges.push(action.payload);
            });
    },
});

export default adminSlice.reducer;