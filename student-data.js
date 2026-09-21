// student-data.js - विद्यार्थी डेटा व एक्सेल फाईल मॅनेजमेंट

let excelData = [];

// एक्सेल फाईल अपलोड झाल्यावर वाचून सेव्ह करणे
function setupExcelReader(onLoadedCallback) {
    let fileInput = document.getElementById('excelFile');
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            let reader = new FileReader();
            reader.onload = function(evt) {
                let data = new Uint8Array(evt.target.result);
                let workbook = XLSX.read(data, {type: 'array'});
                let firstSheet = workbook.SheetNames[0];
                excelData = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet], {header: 1});
                localStorage.setItem('savedExcelData', JSON.stringify(excelData));
                alert("एक्सेल फाईलचा डेटा यशस्वीपणे सेव्ह झाला!");
                if (onLoadedCallback) onLoadedCallback(excelData);
            };
            reader.readAsArrayBuffer(e.target.files[0]);
        });
    }
}

// आधीच सेव्ह असलेला डेटा ब्राउझरमधून लोड करणे
function loadSavedExcelData() {
    let saved = localStorage.getItem('savedExcelData');
    if (saved) {
        excelData = JSON.parse(saved);
    }
    return excelData;
}

// जनरल रजिस्टर नंबरवरून विद्यार्थी शोधणे
function findStudentByRegNo(regNo) {
    if (excelData.length === 0) {
        loadSavedExcelData();
    }
    
    for (let row of excelData) {
        // जर ओळीमध्ये रजिस्टर नंबर आढळला तर तो रो (Row) रिटर्न करेल
        if (row.join(" ").includes(regNo)) {
            return row;
        }
    }
    return null;
}
