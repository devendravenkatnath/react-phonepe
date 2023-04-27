var datasets = {};
var finalDatasets = [];
var colors = ['#4A78EE', '#FF6D00', '#18CE40', '#EE4A78', '#17683B', '#F3FF38', '#9B18CE', '#38F3FF', '#173B68', '#C6C6C6'];
var chartRef;

function PhonepeRosters() {
  const { useState } = React;
  const [tableData, setTableData] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [activeEmployee, setActiveEmployee] = useState({
    status: 'active',
  });

  // Calling API only on first render
  // When chart.js component is created, avoid the render
  if (!tableData.length)
    fetch('http://fetest.pangeatech.net/data')
      .then((res) => res.json())
      .then((data) => {
        setTableData(data);
        setRecords(data);
      });
  return (
    <>
      <div className='row'>
        {/* Users Table  */}
        <div className='table-content col-6'>
          <table className='table table-striped'>
            <thead className='table-header'>
              <tr>
                <th>S no</th>
                <th>Line of Business</th>
                <th>Revenue Type</th>
                <th>Product</th>
                <th>Year</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((record) => {
                return (
                  <tr key={record.S_no}>
                    <td>{record.S_no}</td>
                    <td>{record.line_of_business}</td>
                    <td>{record.revenue_type}</td>
                    <td>{record.product}</td>
                    <td>{record.year}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* User create or edit form */}
        <div className='col-6'>
          <div className='jumbotron pt-4 m-5'>
            <div className='card-heading mb-4'>{isEdit ? 'Edit Employee' : 'Add Employee'}</div>
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

            {isEdit ? (
              <></>
            ) : (
              <button
                className='button'
                onClick={() => {
                  console.log(activeEmployee);
                  //   bomb();
                }}
              >
                Add Employee
                <div className='button__horizontal'></div>
                <div className='button__vertical'></div>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function setRecords(data) {
  // Converting raw data to custom datasets
  for (const index in data) {
    if (!datasets[data[index]['revenue_type']]) datasets[data[index]['revenue_type']] = {};

    if (!datasets[data[index]['revenue_type']][data[index]['month']]) datasets[data[index]['revenue_type']][data[index]['month']] = 0;

    datasets[data[index]['revenue_type']][data[index]['month']] += data[index]['acv'];
  }

  // Merging all datasets generated sofar
  for (const key in datasets) {
    let temp = {};
    temp.label = key;
    temp.data = [];
    temp.data.push(datasets[key]['January'] ?? 0);
    temp.data.push(datasets[key]['February'] ?? 0);
    temp.data.push(datasets[key]['March'] ?? 0);
    temp.data.push(datasets[key]['April'] ?? 0);
    temp.data.push(datasets[key]['May'] ?? 0);
    temp.data.push(datasets[key]['June'] ?? 0);
    temp.data.push(datasets[key]['July'] ?? 0);
    temp.data.push(datasets[key]['August'] ?? 0);
    temp.data.push(datasets[key]['September'] ?? 0);
    temp.data.push(datasets[key]['October'] ?? 0);
    temp.data.push(datasets[key]['November'] ?? 0);
    temp.data.push(datasets[key]['December'] ?? 0);
    temp.borderColor = colors.pop();
    temp.backgroundColor = temp.borderColor;
    finalDatasets.push(temp);
  }

  // Generating Actual Chart
  if (!chartRef) chartRef = new Chart(document.getElementById('myChart'), config);
}

// Chart.js utils
const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const data = {
  labels: labels,
  datasets: finalDatasets,
};

const config = {
  type: 'line',
  data: data,
};

ReactDOM.createRoot(document.getElementById('phonepeRosters')).render(<PhonepeRosters />);
