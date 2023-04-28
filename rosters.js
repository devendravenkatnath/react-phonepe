var datasets = {};
var finalDatasets = [];
var colors = ['#4A78EE', '#FF6D00', '#18CE40', '#EE4A78', '#17683B', '#F3FF38', '#9B18CE', '#38F3FF', '#173B68', '#C6C6C6'];
var chartRef;

function PhonepeRosters() {
  const { useState } = React;
  const [tableData, setTableData] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // employee table data loading status
  const [isDoingAction, setIsDoingAction] = useState(false); // indicates if an emmployee record is adding or editing or deleting
  const [activeEmployee, setActiveEmployee] = useState({
    status: 'active',
  });

  if (!tableData.length)
    fetch('http://localhost:3000/users')
      .then((res) => res.json())
      .then((data) => {
        setTableData(data.result);
      })
      .finally(() => setIsLoading(false));

  function resetActiveEmployee() {
    setActiveEmployee({ status: 'active', name: '', email: '', department: '' });
  }

  // Fetches all employee data
  const fetchRecords = async () => {
    setIsLoading(true);
    fetch('http://localhost:3000/users')
      .then((res) => res.json())
      .then((data) => {
        setTableData(data.result);
      })
      .finally(() => setIsLoading(false));
  };

  // Add employee to database
  async function addEmployee(employeeData) {
    if (!employeeData.name || !employeeData.email) return;
    setIsDoingAction(true);
    fetch('http://localhost:3000/users', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employeeData),
    })
      .then((res) => res.json())
      .then((_) => {
        resetActiveEmployee();
        fetchRecords();
      })
      .finally(() => setIsDoingAction(false));
  }

  // Edit employee
  async function editEmployee(employeeData) {
    setIsDoingAction(true);
    fetch(`http://localhost:3000/users/${employeeData.id}`, {
      method: 'PUT',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employeeData),
    })
      .then((res) => res.json())
      .then((_) => {
        resetActiveEmployee();
        setIsEdit(false);
        fetchRecords();
      })
      .finally(() => setIsDoingAction(false));
  }

  // Delete Employee
  async function deleteEmployee(employeeId) {
    setIsDoingAction(true);
    fetch(`http://localhost:3000/users/${employeeId}`, {
      method: 'DELETE',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((_) => {
        resetActiveEmployee();
        setIsEdit(false);
        fetchRecords();
      })
      .finally(() => setIsDoingAction(false));
  }

  return (
    <>
      <div className='row'>
        {/* Table Data */}
        <div className='table-content pl-4 mt-4 col-6'>
          {isLoading ? (
            // Loader Icon
            <div className='h-100 w-100 d-flex align-items-center justify-content-center'>
              <div className='spinner-border' role='status'>
                <span className='sr-only'>Loading...</span>
              </div>
            </div>
          ) : (
            // Table content
            <table className='table table-striped'>
              <thead className='table-header'>
                <tr>
                  <th>ID</th>
                  <th>Employee Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((record) => {
                  return (
                    <tr key={record.id}>
                      <td>{record.id}</td>
                      <td>{record.name}</td>
                      <td>{record.email}</td>
                      <td>
                        <button
                          className='btn btn-success'
                          onClick={() => {
                            setIsEdit(true);
                            setActiveEmployee(record);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className='btn btn-danger'
                          onClick={() => {
                            deleteEmployee(record.id);
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* User create or edit form */}
        <div className='col-6 position-fixed right-0'>
          <div className='jumbotron pt-4 m-5'>
            <div className='d-flex card-heading mb-4 justify-content-between'>
              {isEdit ? 'Edit Employee' : 'Add Employee'}

              {/* Clear selected employee */}
              {isEdit && (
                <button
                  className='btn btn-success btn-sm'
                  onClick={() => {
                    setIsEdit(false);
                    resetActiveEmployee();
                  }}
                >
                  Add new +
                </button>
              )}
            </div>
            {isEdit && (
              <div className='d-flex mb-2 align-items-center'>
                <span className='col-4'>Employee ID</span>
                <input type='text' className='form-control col-8' disabled value={activeEmployee.id} />
              </div>
            )}
            <div className='d-flex mb-2 align-items-center'>
              <span className='col-4'>Your Name</span>
              <input
                type='text'
                id='name'
                className='form-control col-8'
                placeholder='MJ'
                value={activeEmployee.name}
                onChange={(evnt) => setActiveEmployee({ ...activeEmployee, name: evnt.target.value })}
              />
            </div>
            <div className='d-flex mb-2 align-items-center'>
              <span className='col-4'>Email</span>
              <input
                type='email'
                id='name'
                className='form-control col-8'
                placeholder='guf002@phonepe.com'
                value={activeEmployee.email}
                onChange={(evnt) => setActiveEmployee({ ...activeEmployee, email: evnt.target.value })}
              />
            </div>
            <div className='d-flex mb-2 align-items-center'>
              <span className='col-4'>Department</span>
              <input
                type='text'
                id='name'
                className='form-control col-8'
                placeholder='Designing'
                value={activeEmployee.department}
                onChange={(evnt) => setActiveEmployee({ ...activeEmployee, department: evnt.target.value })}
              />
            </div>
            <div className='d-flex mb-2 align-items-center'>
              <span className='col-4'>Status</span>
              <div className='d-flex' onChange={(evnt) => setActiveEmployee({ ...activeEmployee, status: evnt.target.value })}>
                <div className='form-check mr-3'>
                  <input className='form-check-input' type='radio' name='flexRadioDefault' id='flexRadioDefault1' value='active' />
                  <label className='form-check-label' for='flexRadioDefault1'>
                    Active
                  </label>
                </div>
                <div className='form-check'>
                  <input className='form-check-input' type='radio' name='flexRadioDefault' id='flexRadioDefault2' value='inactive' />
                  <label className='form-check-label' for='flexRadioDefault2'>
                    In Active
                  </label>
                </div>
              </div>
            </div>

            <button
              className='button'
              disabled={isDoingAction}
              onClick={() => {
                isEdit ? editEmployee(activeEmployee) : addEmployee(activeEmployee);
              }}
            >
              {isEdit ? 'Edit Employee' : 'Add Employee'}
              <div className='button__horizontal'></div>
              <div className='button__vertical'></div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('phonepeRosters')).render(<PhonepeRosters />);
