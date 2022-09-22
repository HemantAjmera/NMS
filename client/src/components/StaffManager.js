import { StaffList, StaffCreate } from './index.js'
const StaffManager = () => {
    return <div >
        <h1 style={{fontFamily:"Hindi-Regular"}}>स्टाफ़ मैनेजर</h1>
        <div className="grid">
            <div className="col-12 ">
                <div>
                    <h2 style={{fontFamily:"Hindi-Regular"}}>स्टाफ़ सूची</h2>
                </div>
                <StaffList />
            </div>
            <div className="col-12 ">
                <div>
                    <h2 style={{fontFamily:"Hindi-Regular"}}>नया स्टाफ़ बनाए</h2>
                </div>
                <StaffCreate />
            </div>
        </div>
    </div>
}

export default StaffManager