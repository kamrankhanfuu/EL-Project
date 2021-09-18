import { combineReducers } from "redux";
import authReducer from "./auth.reducer";
import activeRouteReducer from "./active-route.reducer";
import searchReducer from "./search.reducer";

const rootReducer = combineReducers({
  auth: authReducer,
  search: searchReducer,
  activeRoute: activeRouteReducer
});

export default rootReducer;
