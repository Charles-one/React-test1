import { createBrowserRouter } from "react-router-dom";
import Main from "../pages/main"
import Home from "../pages/home"

const routes = [
    {
        path:'/',
        Component:Main,
        children:[
            {
                path:'home',
                Component:Home
            }
        ]
    }
]

export default createBrowserRouter(routes)