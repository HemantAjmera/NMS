import React, { useReducer, useContext } from "react";
import reducer from "./reducer.js";
import axios from "axios";
import {
    DISPLAY_ALERT,
    LOGIN_USER_BEGIN,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_ERROR,
    CLEAR_ALERT,
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
    FETCH_RECENT_BILL_SUCCESS,
    FETCH_RECENT_BILL_BEGIN,
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
} from "./actions.js";

const token = localStorage.getItem("token");
const user = localStorage.getItem("user");
const tableData = localStorage.getItem("tableData")
const AppContext = React.createContext();

const initialAmountsState = {
    totalAmt: 0,
    loadChargePer: 1,
    loadChargeAmt: 0,
    loadPlusTotalAmt: 0,
};

const initialState = {
    isLoading: false,
    showAlert: false,
    alertText: "",
    alertType: "",
    user: user ? JSON.parse(user) : null,
    token: token,
    treeNames: [],
    treeSizes: [],
    billTableData: tableData ? JSON.parse(tableData) : [],
    billAmounts: { ...initialAmountsState },
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
const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const authFetch = axios.create({
        baseURL: "/api/v1",
    });
    authFetch.interceptors.request.use(
        (config) => {
            config.headers.common["Authorization"] = `Bearer ${state.token}`;
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
    authFetch.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            if (error.response.status === 401) {
                logoutUser();
            }
            return Promise.reject(error);
        }
    );

    const displayAlert = () => {
        dispatch({ type: DISPLAY_ALERT });
        clearAlert();
    };
    const clearAlert = () => {
        setTimeout(() => {
            dispatch({ type: CLEAR_ALERT });
        }, 3000);
    };
    const addUserToLocalStorage = ({ user, token }) => {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
    };
    const removeUserToLocalStorage = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("tableData");
    };
    const addTableDataToLocalStorage = (billTableData) => {
        localStorage.removeItem("tableData")
        localStorage.setItem("tableData", JSON.stringify(billTableData))
    }
    const loginUser = async (currentUser) => {
        dispatch({ type: LOGIN_USER_BEGIN });
        try {
            let request = "/api/v1/auth/login"
            if (currentUser.username.match("^[a-zA-Z0-9_]+[.]+[a-zA-Z0-9_]*$")) {
                request = "/api/v1/staffAuth/login"
            } else if (currentUser.username.match("^[a-zA-Z0-9_]*$")) {
                request = "/api/v1/auth/login"
            }
            const response = await axios.post(
                request,
                currentUser
            );
      
            const { user, token } = response.data;
            dispatch({ type: LOGIN_USER_SUCCESS, payload: { user, token } });
            addUserToLocalStorage({ user, token });
        } catch (error) {
            dispatch({
                type: LOGIN_USER_ERROR,
                payload: { msg: error.response.data.msg },
            });
        }
        clearAlert();
    };

    const logoutUser = () => {
        dispatch({ type: LOGOUT_USER, payload: { initialAmountsState } });
        removeUserToLocalStorage();
    };

    
    const fetchTreeNames = async () => {
        try {
            const response = await authFetch.post("/nursery/getTreeNames", { username: state.user.username });
            const { treeNames, treeSizes } = response.data;
            const treeNamesData = [];
            const treeSizesData = [];
            for (let [k, v] of Object.entries(treeNames)) {
                treeNamesData.push({ label: k, value: v });
            }
            for (let [k, v] of Object.entries(treeSizes)) {
                treeSizesData.push({ label: k, value: v });
            }

            dispatch({
                type: FETCH_TREE_NAMES_SUCCESS,
                payload: { treeNames: treeNamesData, treeSizes: treeSizesData },
            });
        } catch (error) {
           
        }
    };
    const addRowInBillTable = (rowData) => {
        const billTableData = state.billTableData;
        billTableData.push(rowData);
        dispatch({ type: ADD_ROW_IN_BILL_TABLE, payload: { billTableData } });
      
        addTableDataToLocalStorage(state.billTableData)
        
    };

    const removeRowInBillTable = (index) => {
        const billTableData = state.billTableData;
        let counter = 1;
        if (index > -1) {
            billTableData.splice(index, 1);
        } else {
            return;
        }
        billTableData.map((item) => {
            item.no = counter;
            counter++;
            return item;
        });
        dispatch({
            type: REMOVE_ROW_IN_BILL_TABLE,
            payload: { billTableData },
        });
        addTableDataToLocalStorage(state.billTableData)
    };
    const updateRowInBillTable = (billTableData) => {
        dispatch({
            type: UPDATE_ROW_IN_BILL_TABLE,
            payload: { billTableData },
        });
        addTableDataToLocalStorage(state.billTableData)
    };
    const updateSizeRowInBillTable = (_index, _size) => {
        const billTableData = state.billTableData;
        billTableData[_index].size = _size;
        dispatch({
            type: UPDATE_SIZE_ROW_IN_BILL_TABLE,
            payload: { billTableData },
        });
        addTableDataToLocalStorage(state.billTableData)
    };
    // if (state.billTableData.length === 0 && !state.billAmounts.totalAmt === 0) {
    //     state.billAmounts = initialAmountsState;
    // }
    const updateBillAmounts = () => {
        let billAmounts = { ...state.billAmounts };

        if (state.billTableData.length > 0) {
            let _totalAmount = 0;
            state.billTableData.forEach(
                (bill) => (_totalAmount += bill.totalPrice)
            );
            billAmounts.totalAmt = _totalAmount;
            billAmounts.loadChargeAmt =
            Math.ceil((billAmounts.loadChargePer / 100) * billAmounts.totalAmt);
            billAmounts.loadPlusTotalAmt =
            Math.ceil(billAmounts.totalAmt + billAmounts.loadChargeAmt);
        } else {
            billAmounts = initialAmountsState;
        }
        dispatch({ type: UPDATE_BILL_AMOUNTS, payload: { billAmounts } });
    };
    const updateBillAmountsWithPercent = (percent) => {
        let billAmounts = { ...state.billAmounts };

        if (state.billTableData.length > 0) {
            let _totalAmount = 0;
            state.billTableData.forEach(
                (bill) => (_totalAmount += bill.totalPrice)
            );
            billAmounts.totalAmt = _totalAmount;
            billAmounts.loadChargePer = percent;
            billAmounts.loadChargeAmt = Math.ceil((billAmounts.loadChargePer / 100) * billAmounts.totalAmt);
            billAmounts.loadPlusTotalAmt =
            Math.ceil(billAmounts.totalAmt + billAmounts.loadChargeAmt);
        } else {
            billAmounts = initialAmountsState;
        }
        dispatch({ type: UPDATE_BILL_AMOUNTS, payload: { billAmounts } });
    };
    const updateCustomerName = (customerName) => {
        dispatch({ type: UPDATE_CUSTOMER_NAME, payload: { customerName } });
    };

    const resetBillState = () => {
        dispatch({ type: REST_BILL_STATE, payload: { initialAmountsState } });
    };

    const displayPrintPreview = (showPrintPreview) => {
        dispatch({
            type: DISPLAY_PRINT_PREVIEW,
            payload: { showPrintPreview },
        });
    };
    const updateBillNo = async () => {
        dispatch({ type: UPDATE_BILL_NUMBER_BEGIN });
        try {
            const { customerName, customerNumber } = state;
            const { totalAmt, loadChargeAmt, loadPlusTotalAmt } =
                state.billAmounts;
            let tempTreeList = {};
            state.billTableData.forEach(
                (tree) =>
                (tempTreeList[tree.no] = {
                    tree: tree.tree,
                    size: tree.size,
                    quantity: tree.quantity,
                    price: tree.price,
                    totalPrice: tree.totalPrice,
                })
            );

            
            const bill = {
                customerName: customerName,
                customerNumber: customerNumber,
                price: totalAmt,
                loadingCharge: loadChargeAmt,
                discount: 0,
                totalPrice: loadPlusTotalAmt,
                paymentMethod: "Online",
                payInCash: 0,
                payInOnline: 0,
                totalPaid: 0,
                dueAmount: loadPlusTotalAmt,
                treeList: { ...tempTreeList },
            };
            let response = await authFetch.post("/nursery", { ...bill });
           
            dispatch({type: SET_LAST_BILL_VALUES, payload: {bill: response.data.bill}})
            dispatch({
                type: UPDATE_BILL_NUMBER_SUCCESS,
                payload: { billNo: response.data.bill.billNo },
            });
        } catch (err) {
            dispatch({ type: UPDATE_BILL_NUMBER_ERROR });
          
        }
    };
    const createStaff = async ({ firstname, lastname, username, password, active }) => {
        dispatch({ type: CREATE_STAFF_BEGIN })
        try {
            await authFetch.post("/staffAuth/register", { name: firstname, lastName: lastname, username, password, active })
            dispatch({ type: CREATE_STAFF_SUCCESS })
          
        } catch (error) {
            dispatch({ type: CREATE_STAFF_ERROR })
           
        }

    }
    const fetchStaffList = async () => {
        dispatch({ type: FETCH_STAFF_LIST_BEGIN });
        state.staffList.length = 0
        try {
            let response = await authFetch.get("/staffAuth")
            response.data.staffList.forEach((staff, i) => {
                state.staffList.push({ _id: staff._id, no: (i + 1), name: (staff.name + " " + staff.lastName), username: staff.username, password: staff.password, active: staff.active })
            })
            dispatch({ type: FETCH_STAFF_LIST_SUCCESS });
        } catch (error) {
            dispatch({ type: FETCH_STAFF_LIST_ERROR });
            
        }
    }
    
    const updateStaffList = (staffList) => {
        dispatch({ type: UPDATE_STAFF_LIST, payload: { staffList: staffList } })
    }
    const updateServerStaffList = async (staffList) => {
        dispatch({ type: UPDATE_SERVER_STAFF_LIST_BEGIN });
        try {
            dispatch({ type: UPDATE_SERVER_STAFF_LIST_SUCCESS });
             await authFetch.patch("/staffAuth/update", { staffList })
           
        } catch (error) {
            dispatch({ type: UPDATE_SERVER_STAFF_LIST_ERROR });
          
        }
    }
    const draftBill = async () => {
        dispatch({ type: DRAFT_BILL_BEGIN });
        try {
           await  authFetch.post("/staff/draftBill", { username:state.user.username, customerName:state.customerName, customerNumber:state.customerNumber, billItemsList: state.billTableData });

            dispatch({ type: DRAFT_BILL_SUCCESS, payload: { msg: "बिल गया" }});
            resetBillState();
            localStorage.removeItem("tableData");
        } catch (error) {
            dispatch({
                type: DRAFT_BILL_ERROR,
                payload: { msg: "बिल भेजने में समस्या" },
            });
        }
        clearAlert();
    }
    const fetchDraftBill = async  () => {
        try {
            const response = await authFetch.get("/staff/draftBill");
            dispatch({type: FETCH_DRAFT_BILL, payload: { draftBillList:response.data.draftBillList}})
        } catch (error) {
      
        }
    }
    const deleteStaff = async  ({staffId}) => {
        try {
            await authFetch.post("/staffAuth/delete", { staffId: staffId });

            dispatch({type: DELETE_STAFF})
        } catch (error) {
        
        }
    }
    const updateBillComponentsWithDraft = ({customerName,customerNumber, billItemsList}) => {
        dispatch({type: UPDATE_BILL_COMPONENT_WITH_DRAFT, payload: { customerName: customerName,customerNumber:customerNumber, billTableData: billItemsList}})
    }
    const fetchRecentBills = async () => {
        dispatch({type: FETCH_RECENT_BILL_BEGIN})
        try{
            const response = await authFetch.get("/nursery/getRecentBills")
            dispatch({type: FETCH_RECENT_BILL_SUCCESS, payload: { recentBillList : response.data.recentBills}})
        }catch(error){
            dispatch({type: FETCH_RECENT_BILL_ERROR})
          
        }
    }
    const updateBill = async ({finalBill}) =>{
        dispatch({type: UPDATE_BILL_BEGIN})
        try{
            await authFetch.post("/nursery/updateBill", {...finalBill})
            
            dispatch({type: UPDATE_BILL_SUCCESS})
        }catch(error){
            dispatch({type: UPDATE_BILL_ERROR})
        
        }
    }
    const resetLastBillValue = () => {
        dispatch({type: REST_LAST_BILL_VALUE})
    }

    const changeAddTreeWindowToggle = (value) =>{
        dispatch({type: CHANGE_ADD_TREE_WINDOW, payload: {isAddTreeWindow:value}})
    }
    const updateDraftBillId = (draftId) =>{
        dispatch({type: UPDATE_DRAFT_ID_VALUE, payload: {id: draftId}})
    }
    const deleteDraft = async () => {
        if(state.selectedDraftBillId === "") return;
        dispatch({type: DELETE_DRAFT_BEGIN})
        try{
            await authFetch.post("/staff/deleteDraftBill", {draftId: state.selectedDraftBillId})
           
            dispatch({type: DELETE_DRAFT_SUCCESS})
        }catch(error){
            dispatch({type: DELETE_DRAFT_ERROR})
           
        }
    }
    const updateCustomerNumber = (number) => {
        dispatch({type: UPDATE_CUSTOMER_NUMBER, payload: {number:number}})
    }
    const getAllBillTreeListById = async (id) => {
        let res;
        dispatch({type: FETCH_BILL_TREE_LIST_BEGIN})
        try{
            const response = await authFetch.post("/nursery/singleBillTrees", {treeListId:id})
     
            res = response.data
            dispatch({type: FETCH_BILL_TREE_LIST_SUCCESS})
        }catch(error){
            res = null
            dispatch({type: FETCH_BILL_TREE_LIST_ERROR})
          
        }
        return res;
    }
    const fetchBillsByDate = async (startDate, endDate) => {
        let res;
        dispatch({type: REQUEST_BEGIN})
        try{
            const response = await authFetch.post("/nursery/getBillsByDate", {startDate:startDate, endDate:endDate})
           
            res = response.data
            dispatch({type: REQUEST_SUCCESS, payload: { msg: ""}})
        }catch(error){
            res = null
            dispatch({type: REQUEST_ERROR })
            
        }
        clearAlert();
        return res;
    }
    const fetchBillsStartEndDate = async () => {
        let res;
        dispatch({type: REQUEST_BEGIN})
        try{
            const response = await authFetch.get("/nursery/getBillsStartEndDate")
            
            res = response.data
            dispatch({type: REQUEST_SUCCESS, payload: { msg: ""}})
        }catch(error){
            res = null
            dispatch({type: REQUEST_ERROR, payload: { msg: ""}})
            
        }
        clearAlert();
        return res;
    }
    
    const fetchBillsByBillNoAndName = async (billNo, name) => {
        let res;
        dispatch({type: REQUEST_BEGIN})
        try{
            const response = await authFetch.post("/nursery/getBillsByBillNoOrName",{billNo: billNo, name:name})
           
            res = response.data
            dispatch({type: REQUEST_SUCCESS, payload: { msg: ""}})
        }catch(error){
            res = null
            dispatch({type: REQUEST_ERROR, payload: { msg: ""}})
            
        }
        clearAlert();
        return res;
    }
    const fetchBillsMonthByYear = async (year) => {
        let res;
        dispatch({type: REQUEST_BEGIN})
        try{
            const response = await authFetch.post("/nursery/getBillsStartEndMonthByYear",{year: year})
           
            res = response.data
            dispatch({type: REQUEST_SUCCESS, payload: { msg: ""}})
        }catch(error){
            res = null
            dispatch({type: REQUEST_ERROR, payload: { msg: ""}})
            
        }
        clearAlert();
        return res;
    }
    const fetchAmountsByMonth = async (month,year) => {
        let res;
        dispatch({type: REQUEST_BEGIN})
        try{
          
            const response = await authFetch.post("/nursery/getAmountsByMonth",{month:month, year: year})
            
            res = response.data
            dispatch({type: REQUEST_SUCCESS, payload: { msg: ""}})
        }catch(error){
            res = null
            dispatch({type: REQUEST_ERROR, payload: { msg: ""}})
            
        }
        clearAlert();
        return res;
    }
    const insertTreeName = async ({hindiName, englishName}) => {
        let res;
        dispatch({type: REQUEST_BEGIN})
        try{
            const response = await authFetch.post("/nursery/insertTreeName",{hindiName:hindiName, englishName: englishName})
            
            res = response.data
            dispatch({type: REQUEST_SUCCESS, payload: { msg: "पेड़ जोड दिया", showAlert: true }})
        }catch(error){
            res = null
            dispatch({type: REQUEST_ERROR, payload: { msg: ""}})
            
        }
        clearAlert();
        return res;
    }
    const insertTreeSize = async (treeSize) => {
        let res;
        dispatch({type: REQUEST_BEGIN})
        try{
            const response = await authFetch.post("/nursery/insertTreeSize",{treeSize:treeSize})
            
            res = response.data
            dispatch({type: REQUEST_SUCCESS, payload: { msg: "पेड़ का आकार जोड दिया" , showAlert: true}})
        }catch(error){
            res = null
            dispatch({type: REQUEST_ERROR, payload: { msg: ""}})
            
        }
        clearAlert();
        return res;
    }
    const removeTreeName = async ({hindiName}) => {
        let res;
        dispatch({type: REQUEST_BEGIN})
        try{
            const response = await authFetch.post("/nursery/removeTreeName",{hindiName:hindiName})
            
            res = response.data
            dispatch({type: REQUEST_SUCCESS, payload: { msg: "पेड़ हटा दिया", showAlert: true}})
        }catch(error){
            res = null
            dispatch({type: REQUEST_ERROR, payload: { msg: ""}})
            
        }
        clearAlert();
        return res;
    }
    const removeTreeSize = async (treeSize) => {
        let res;
        dispatch({type: REQUEST_BEGIN})
        try{
            const response = await authFetch.post("/nursery/removeTreeSize",{treeSize:treeSize})
            
            res = response.data
            dispatch({type: REQUEST_SUCCESS, payload: { msg: "पेड़ का आकार हटा दिया", showAlert: true}})
        }catch(error){
            res = null
            dispatch({type: REQUEST_ERROR, payload: { msg: ""}})
            
        }
        clearAlert();
        return res;
    }
    return (
        <AppContext.Provider
            value={{
                ...state,
                displayAlert,
                loginUser,
                logoutUser,
                fetchTreeNames,
                addRowInBillTable,
                removeRowInBillTable,
                updateRowInBillTable,
                updateSizeRowInBillTable,
                updateBillAmounts,
                updateBillAmountsWithPercent,
                updateCustomerName,
                resetBillState,
                displayPrintPreview,
                updateBillNo,
                createStaff,
                fetchStaffList,
                updateStaffList,
                updateServerStaffList,
                draftBill,
                fetchDraftBill,
                updateBillComponentsWithDraft,
                deleteStaff,
                fetchRecentBills,
                updateBill,
                resetLastBillValue,
                changeAddTreeWindowToggle,
                updateDraftBillId,
                deleteDraft,
                updateCustomerNumber,
                getAllBillTreeListById,
                fetchBillsByDate,
                fetchBillsStartEndDate,
                fetchBillsByBillNoAndName,
                fetchBillsMonthByYear,
                fetchAmountsByMonth,
                insertTreeName,
                removeTreeName,
                insertTreeSize,
                removeTreeSize,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

const useAppContext = () => {
    return useContext(AppContext);
};

export { AppProvider, useAppContext };
