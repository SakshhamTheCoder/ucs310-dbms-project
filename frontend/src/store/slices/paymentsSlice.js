import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

const initialState = {
    payments: [],
    myPayments: [],
    loading: false,
    error: null,
};

// Async thunks
export const initiatePayment = createAsyncThunk(
    'payments/initiatePayment',
    async (paymentData, { rejectWithValue }) => {
        try {
            const response = await api.post('/payments/initiate', paymentData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to initiate payment');
        }
    }
);

export const fetchMyPayments = createAsyncThunk(
    'payments/fetchMyPayments',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/payments/my');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch payments');
        }
    }
);

export const fetchAllPayments = createAsyncThunk(
    'payments/fetchAllPayments',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/payments/all');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch all payments');
        }
    }
);

export const updatePaymentStatus = createAsyncThunk(
    'payments/updatePaymentStatus',
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/payments/${id}/status`, { status });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update payment status');
        }
    }
);

// Add listAllPayments async thunk
export const listAllPayments = createAsyncThunk(
    'payments/listAllPayments',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/payments/all');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch all payments');
        }
    }
);

const paymentsSlice = createSlice({
    name: 'payments',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(initiatePayment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(initiatePayment.fulfilled, (state, action) => {
                state.loading = false;
                state.payments.push(action.payload);
            })
            .addCase(initiatePayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchMyPayments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyPayments.fulfilled, (state, action) => {
                state.loading = false;
                state.myPayments = action.payload;
            })
            .addCase(fetchMyPayments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchAllPayments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllPayments.fulfilled, (state, action) => {
                state.loading = false;
                state.payments = action.payload;
            })
            .addCase(fetchAllPayments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updatePaymentStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePaymentStatus.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.payments.findIndex((p) => p.id === action.payload.id);
                if (index !== -1) {
                    state.payments[index] = action.payload;
                }
            })
            .addCase(updatePaymentStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(listAllPayments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(listAllPayments.fulfilled, (state, action) => {
                state.loading = false;
                state.payments = action.payload;
            })
            .addCase(listAllPayments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default paymentsSlice.reducer;