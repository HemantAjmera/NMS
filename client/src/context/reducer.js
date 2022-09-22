import {
    CLEAR_ALERT,
    DISPLAY_ALERT,
    LOGIN_USER_BEGIN,
    LOGIN_USER_ERROR,
    LOGIN_USER_SUCCESS,
    LOGOUT_USER,
    FETCH_TREE_NAMES_SUCCESS,
    ADD_ROW_IN_BILL_TABLE,
    REMOVE_ROW_IN_BILL_TABLE,
    UPDATE_SIZE_ROW_IN_BILL_TABLE,
    UPDATE_ROW_IN_BILL_TABLE,
    UPDATE_BILL_AMOUNTS,
    UPDATE_CUSTOMER_NAME,
    REST_BILL_STATE,
    DISPLAY_PRINT_PREVIEW,
    UPDATE_BILL_NUMBER,
    UPDATE_BILL_NUMBER_BEGIN,
    UPDATE_BILL_NUMBER_SUCCESS,
    UPDATE_BILL_NUMBER_ERROR,
    CREATE_STAFF_BEGIN,
    CREATE_STAFF_SUCCESS,
    CREATE_STAFF_ERROR,
    FETCH_STAFF_LIST_BEGIN,
    FETCH_STAFF_LIST_SUCCESS,
    FETCH_STAFF_LIST_ERROR,
    UPDATE_STAFF_LIST,
    UPDATE_SERVER_STAFF_LIST_BEGIN,
    UPDATE_SERVER_STAFF_LIST_SUCCESS,
    UPDATE_SERVER_STAFF_LIST_ERROR,
    DRAFT_BILL_BEGIN,
    DRAFT_BILL_SUCCESS,
    DRAFT_BILL_ERROR,
    FETCH_DRAFT_BILL,
    UPDATE_BILL_COMPONENT_WITH_DRAFT,
    DELETE_STAFF,
    FETCH_RECENT_BILL_BEGIN,
    FETCH_RECENT_BILL_SUCCESS,
    FETCH_RECENT_BILL_ERROR,
    UPDATE_BILL_BEGIN,
    UPDATE_BILL_ERROR,
    UPDATE_BILL_SUCCESS,
    SET_LAST_BILL_VALUES,
    REST_LAST_BILL_VALUE,
    CHANGE_ADD_TREE_WINDOW,
    UPDATE_DRAFT_ID_VALUE,
    DELETE_DRAFT_BEGIN,
    DELETE_DRAFT_SUCCESS,
    DELETE_DRAFT_ERROR,
    UPDATE_CUSTOMER_NUMBER,
    FETCH_BILL_TREE_LIST_BEGIN,
    FETCH_BILL_TREE_LIST_SUCCESS,
    FETCH_BILL_TREE_LIST_ERROR,
    REQUEST_BEGIN,
    REQUEST_SUCCESS,
    REQUEST_ERROR,
} from "./actions";

const reducer = (state, action) => {
    if (action.type === DISPLAY_ALERT) {
        return {
            ...state,
            showAlert: true,
            alertType: "error",
            alertText: "कृपया सभी स्थान भरें",
        };
    }
    if (action.type === CLEAR_ALERT) {
        return {
            ...state,
            showAlert: false,
            alertType: "",
            alertText: "",
        };
    }
    if (action.type === LOGOUT_USER) {
        return {
            isLoading: false,
            showAlert: false,
            alertText: "",
            alertType: "",
            user: null,
            token: null,
            treeNames: [],
            treeSizes: [],
            billTableData: [],
            billAmounts: { ...action.payload.initialAmountsState },
            billNo: 0,
            customerName: "",
            showPrintPreview: false,
            staffList: [],
            draftBillList: [],
            recentBillList: [],
            isFetching: false,
            lastBill: {},
            isAddTreeWindow: true,
            selectedDraftBillId: "",
            customerNumber: "",
        };
    }

    if (action.type === LOGIN_USER_BEGIN) {
        return { ...state, isLoading: true };
    }
    if (action.type === LOGIN_USER_SUCCESS) {
        return {
            ...state,
            isLoading: false,
            token: action.payload.token,
            user: action.payload.user,
            showAlert: true,
            alertType: "success",
            alertText: "आपका स्वागत है",
        };
    }
    if (action.type === LOGIN_USER_ERROR) {
        return {
            ...state,
            isLoading: false,
            showAlert: true,
            alertType: "error",
            alertText: action.payload.msg,
        };
    }
    if (action.type === FETCH_TREE_NAMES_SUCCESS) {
        return {
            ...state,
            treeNames: action.payload.treeNames,
            treeSizes: action.payload.treeSizes,
        };
    }
    if (
        action.type === ADD_ROW_IN_BILL_TABLE ||
        action.type === REMOVE_ROW_IN_BILL_TABLE ||
        action.type === UPDATE_ROW_IN_BILL_TABLE ||
        action.type === UPDATE_SIZE_ROW_IN_BILL_TABLE
    ) {
        return {
            ...state,
            billTableData: action.payload.billTableData,
        };
    }
    if (action.type === UPDATE_BILL_AMOUNTS) {
        return {
            ...state,
            billAmounts: action.payload.billAmounts,
        };
    }
    if (action.type === UPDATE_CUSTOMER_NAME) {
        return {
            ...state,
            customerName: action.payload.customerName,
        };
    }
    if (action.type === REST_BILL_STATE) {
        const initialAmountsState = action.payload.initialAmountsState;
        return {
            ...state,
            billNo: 0,
            isLoading: false,
            billTableData: [],
            billAmounts: { ...initialAmountsState },
            customerName: "",
            customerNumber: "",
        };
    }
    if (action.type === DISPLAY_PRINT_PREVIEW) {
        return { ...state, showPrintPreview: action.payload.showPrintPreview };
    }
    if (action.type === UPDATE_BILL_NUMBER) {
        return { ...state, billNo: action.payload.billNo };
    }
    if (action.type === UPDATE_BILL_NUMBER_BEGIN) {
        return { ...state, isLoading: true };
    }
    if (action.type === UPDATE_BILL_NUMBER_SUCCESS) {
        return { ...state, isLoading: false, billNo: action.payload.billNo };
    }
    if (action.type === UPDATE_BILL_NUMBER_ERROR) {
        return { ...state, isLoading: false, billNo: 0 };
    }

    if (action.type === CREATE_STAFF_BEGIN) {
        return { ...state, isLoading: true }
    }
    if (action.type === CREATE_STAFF_SUCCESS) {
        return { ...state, isLoading: false }
    }
    if (action.type === CREATE_STAFF_ERROR) {
        return { ...state, isLoading: false }
    }
    if (action.type === FETCH_STAFF_LIST_BEGIN) {
        return { ...state }
    }
    if (action.type === FETCH_STAFF_LIST_SUCCESS) {
        return { ...state }
    }
    if (action.type === FETCH_STAFF_LIST_ERROR) {
        return { ...state }
    }
    if (action.type === UPDATE_STAFF_LIST) {
        return { ...state, staffList: action.payload.staffList }
    }
    if (action.type === UPDATE_SERVER_STAFF_LIST_BEGIN) {
        return { ...state, isLoading: true }
    }
    if (action.type === UPDATE_SERVER_STAFF_LIST_SUCCESS) {
        return { ...state, isLoading: false }
    }
    if (action.type === UPDATE_SERVER_STAFF_LIST_ERROR) {
        return { ...state, isLoading: false }
    }

    if (action.type === DRAFT_BILL_BEGIN) {
        return { ...state, isLoading: true }
    }
    if (action.type === DRAFT_BILL_SUCCESS) {
        return { ...state, isLoading: false,  
            showAlert: true,
            alertType: "success",
            alertText: action.payload.msg, }
    }
    if (action.type === DRAFT_BILL_ERROR) {
        return { ...state, isLoading: false,
            showAlert: true,
            alertType: "error",
            alertText: action.payload.msg }
    }
    if (action.type === FETCH_DRAFT_BILL) {
        return { ...state, draftBillList: action.payload.draftBillList }
    }
    if (action.type === UPDATE_BILL_COMPONENT_WITH_DRAFT) {
        return { ...state, customerName: action.payload.customerName, customerNumber: action.payload.customerNumber, billTableData: action.payload.billTableData }
    }
    if (action.type === DELETE_STAFF) {
        return { ...state }
    }
    if (action.type === FETCH_RECENT_BILL_BEGIN) {
        return { ...state, isFetching: true }
    }
    if (action.type === FETCH_RECENT_BILL_SUCCESS) {
        return { ...state, recentBillList: action.payload.recentBillList, isFetching: false }
    }
    if (action.type === FETCH_RECENT_BILL_ERROR) {
        return { ...state, isFetching: false }
    }
    if (action.type === UPDATE_BILL_BEGIN) {
        return { ...state, isLoading: true }
    }
    if (action.type === UPDATE_BILL_SUCCESS) {
        return { ...state, isLoading: false }
    }
    if (action.type === UPDATE_BILL_ERROR) {
        return { ...state, isLoading: false }
    }
    if (action.type === SET_LAST_BILL_VALUES) {
        return { ...state, lastBill: action.payload.bill }
    }
    if (action.type === REST_LAST_BILL_VALUE) {
        return { ...state, lastBill: {} }
    }
    if (action.type === CHANGE_ADD_TREE_WINDOW) {
        return { ...state, isAddTreeWindow: action.payload.isAddTreeWindow }
    }
    if (action.type === UPDATE_DRAFT_ID_VALUE) {
        return { ...state, selectedDraftBillId: action.payload.id }
    }
    if (action.type === DELETE_DRAFT_BEGIN) {
        return { ...state, isLoading: true }
    }
    if (action.type === DELETE_DRAFT_SUCCESS) {
        return { ...state, selectedDraftBillId: "", isLoading: false }
    }
    if (action.type === DELETE_DRAFT_ERROR) {
        return { ...state, selectedDraftBillId: "", isLoading: false }
    }
    if (action.type === UPDATE_CUSTOMER_NUMBER) {
        return {
            ...state,
            customerNumber: action.payload.number,
        };
    }
    if (action.type === FETCH_BILL_TREE_LIST_BEGIN) {
        return { ...state, isLoading: true }
    }
    if (action.type === FETCH_BILL_TREE_LIST_SUCCESS) {
        return { ...state, selectedDraftBillId: "", isLoading: false }
    }
    if (action.type === FETCH_BILL_TREE_LIST_ERROR) {
        return { ...state, selectedDraftBillId: "", isLoading: false }
    }
    if (action.type === REQUEST_BEGIN) {
        return { ...state, isFetching: true }
    }
    if (action.type === REQUEST_SUCCESS) {
        return {
            ...state, isFetching: false, 
            showAlert: action.payload.showAlert,
            alertType: "success",
            alertText: action.payload.msg,
        }
    }
    if (action.type === REQUEST_ERROR) {
        return { ...state, isFetching: false, 
            showAlert: true,
            alertType: "error",
            alertText: "कृपया कुछ समय बाद निवेदन करें", }
    }
    throw new Error(`no such action: ${action.type}`);
};

export default reducer;
