import { Sidebar } from 'primereact/sidebar'
import { Button } from 'primereact/button'
import { useState } from 'react'
import NavLinks from '../../components/NavLinks.js'
import { Outlet } from 'react-router-dom'
import { useAppContext } from '../../context/appContext.js'
import screenSize from '../../utils/screenSize.js'
const Dashboard = () => {
    const { logoutUser } = useAppContext();
    const [visible, setVisible] = useState(false)
    const handleChange = () => {
            logoutUser();
    };
    let size = screenSize();
    return <>
        <Sidebar className="p-sidebar-sm" visible={visible} closeOnEscape={true} onHide={() => setVisible(false)}>
            <div className='text-center'>
                <h1>नियंत्रण-पट्ट</h1>
                <MenuItems />

            </div>
        </Sidebar>
        <div style={{ position: "fixed", overflow: 'auto' }} className="grid h-screen w-screen   " >
            <div className='hidden sm:hidden md:block shadow-2 col-0 sm:col-0 md:col-3 lg:col-3 xl:col-2 '>
                <div className='flex justify-content-center'>
                    <h1 style={{ fontFamily: "Hindi-Regular" }}>नियंत्रण-पट्ट</h1>
                </div>
                <MenuItems />
            </div>
            <div className=' col-12 sm:col-12 md:col-9 lg:col-9 xl:col-10 '>
                <div className='grid '>
                    <div className='col-12 pb-1 pt-3 shadow-1'>

                        <div className='grid  '>

                            <div className='col-3 p-0 m-0'>
                                <Button icon="pi pi-bars" className='p-button-rounded p-button-text block sm:block md:hidden ml-3 ' onClick={() => setVisible(true)} iconPos="right" />
                            </div>
                            <div className='flex justify-content-center col-6 '>
                                <h2 className='m-0' style={{ fontFamily: "Hindi-Regular", }}>श्री कृष्णा नर्सरी फार्म</h2>
                            </div>
                            <div className='col-3  flex pr-4 justify-content-end'>
                                <Button icon="pi pi-sign-out" label={size.winWidth < 769 ? "" : "बाहर जाए"} className="p-button-secondary p-button-outlined p-button-rounded" onClick={handleChange} />  
                            </div>
                        </div>
                    </div>
                    <div className='col-12'>
                        <div>
                            <Outlet />
                        </div>
                    </div>

                </div>


            </div>
        </div>
    </>
}
const MenuItems = () => {
    return <>
        <NavLinks />
    </>
}
export default Dashboard


/*
<Sidebar className="p-sidebar-sm" visible={visible} onHide={() => setVisible(false)}>
            Content
        </Sidebar>
        <div style={{ border: "1px solid red" }} className="grid">
            <div className="col-6">
                <Button icon="pi pi-bars" className='p-button-rounded p-button-text' onClick={()=>setVisible(true)} iconPos="right" />
            </div>
            <div className="col-6">

            </div>
        </div>
*/