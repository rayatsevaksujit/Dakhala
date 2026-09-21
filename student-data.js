// student-data.js - विद्यार्थी डेटा व लॉजिक फाईल

window.onload = function() {
    loadSavedData();
    loadSchoolInfo();
};

function openTab(tabName) {
    let contents = document.getElementsByClassName('tab-content');
    for(let c of contents) c.classList.remove('active');
    
    document.getElementById(tabName).classList.add('active');
    document.getElementById('homeDashboard').style.display = 'none';
    document.getElementById('backBar').style.display = 'block';
}

function goHome() {
    let contents = document.getElementsByClassName('tab-content');
    for(let c of contents) c.classList.remove('active');
    
    document.getElementById('homeDashboard').style.display = 'block';
    document.getElementById('backBar').style.display = 'none';
}

// ॲडमिन पासवर्ड टाकून माहिती एडिट करण्यासाठी अनलॉक करणे
function requestAdminUnlock() {
    let pass = prompt("प्रशासन पासवर्ड टाका (Admin Password):");
    if(pass === "admin123") { 
        document.getElementById('instName').disabled = false;
        document.getElementById('schoolName').disabled = false;
        document.getElementById('schoolAddress').disabled = false;
        document.getElementById('schoolContact').disabled = false;
        document.getElementById('schoolExtra').disabled = false;
        document.getElementById('saveBtn').style.display = 'block';
        alert("माहिती एडिट करण्यासाठी अनलॉक झाली आहे!");
    } else if(pass !== null) {
        alert("चुकीचा पासवर्ड!");
    }
}

function saveSchoolInfo() {
    let schoolData = {
        inst: document.getElementById('instName').value,
        school: document.getElementById('schoolName').value,
        address: document.getElementById('schoolAddress').value,
        contact: document.getElementById('schoolContact').value,
        extra: document.getElementById('schoolExtra').value
    };
    localStorage.setItem('schoolProfile', JSON.stringify(schoolData));
    
    // सेव्ह झाल्यावर पुन्हा लॉक करणे
    document.getElementById('instName').disabled = true;
    document.getElementById('schoolName').disabled = true;
    document.getElementById('schoolAddress').disabled = true;
    document.getElementById('schoolContact').disabled = true;
    document.getElementById('schoolExtra').disabled = true;
    document.getElementById('saveBtn').style.display = 'none';
    
    alert("शाळेची माहिती यशस्वीपणे सेव्ह व लॉक झाली!");
}

function loadSchoolInfo() {
    let saved = localStorage.getItem('schoolProfile');
    if(saved) {
        let data = JSON.parse(saved);
        document.getElementById('instName').value = data.inst || "";
        document.getElementById('schoolName').value = data.school || "";
        document.getElementById('schoolAddress').value = data.address || "";
        document.getElementById('schoolContact').value = data.contact || "";
        document.getElementById('schoolExtra').value = data.extra || "";
    }
}

const marathiMonths = {
    1: "जानेवारी", 2: "फेब्रुवारी", 3: "मार्च", 4: "एप्रिल", 
    5: "मे", 6: "जून", 7: "जुलै", 8: "ऑगस्ट", 
    9: "सप्टेंबर", 10: "ऑक्टोबर", 11: "नोव्हेंबर", 12: "डिसेंबर"
};

function numberToMarathiWords(n) {
    const words = {
        1: "पहिली", 2: "दोन", 3: "तीन", 4: "चार", 5: "पाच", 
        6: "सहा", 7: "सात", 8: "आठ", 9: "नऊ", 10: "दहा",
        11: "अकरा", 12: "बारा", 13: "तेरा", 14: "चौदा", 15: "पंधरा", 
        16: "सोळा", 17: "सतरा", 18: "अठरा", 19: "एकोणीस", 20: "वीस",
        21: "एकवीस", 22: "बावीस", 23: "तेवीस", 24: "चोवीस", 25: "पंचवीस", 
        26: "सव्वीस", 27: "सत्तावीस", 28: "अठ्ठावीस", 29: "एकूणतीस", 30: "तीस", 
        31: "एकतीस"
    };
    return words[n] || n;
}

function excelDateToJSDate(serial) {
    if (isNaN(serial)) return serial;
    let utc_days = Math.floor(serial - 25569);
    return new Date(utc_days * 86400 * 1000);
}

function dateToMarathi(dateVal) {
    try {
        let d = (typeof dateVal === 'number') ? excelDateToJSDate(dateVal) : new Date(dateVal);
        if (isNaN(d)) return dateVal;
        return `${numberToMarathiWords(d.getDate())} ${marathiMonths[d.getMonth() + 1]} सन ${d.getFullYear()}`;
    } catch(e) { return dateVal; }
}

let excelData = [];

// नोट: तुम्ही एक्सेल फाईल अपलोड करण्यासाठी भविष्यात येथे कोड जोडू शकता किंवा बॅकएंड/लोकल फाईल लिंक करू शकता.
function loadSavedData() {
    let saved = localStorage.getItem('savedExcelData');
    if(saved) {
        excelData = JSON.parse(saved);
    }
}

function searchStudent() {
    let regNo = document.getElementById('regNo').value.trim();
    if(!regNo) {
        alert("कृपया जनरल रजिस्टर नंबर टाका!");
        return;
    }
    if(excelData.length === 0) {
        alert("एक्सेल डेटा उपलब्ध नाही!");
        return;
    }

    let foundRow = null;
    for(let row of excelData) {
        if(row.join(" ").includes(regNo)) {
            foundRow = row;
            break;
        }
    }

    if(!foundRow) {
        alert("या रजिस्टर नंबरची नोंद आढळली नाही.");
        document.getElementById('lcCard').style.display = 'none';
        document.getElementById('printBtn').style.display = 'none';
        return;
    }

    let savedSchool = JSON.parse(localStorage.getItem('schoolProfile')) || {};
    document.getElementById('pInst').innerText = savedSchool.inst || "";
    document.getElementById('pSchool').innerText = savedSchool.school ? "शाळेचे नाव : " + savedSchool.school : "";
    document.getElementById('pAddress').innerText = savedSchool.address ? "पत्ता : " + savedSchool.address : "";
    document.getElementById('pContact').innerText = savedSchool.contact || "";

    document.getElementById('outReg').innerText = regNo;
    document.getElementById('outName').innerText = foundRow[2] || foundRow[1] || "";
    let dobRaw = foundRow[4] || foundRow[3] || "";
    document.getElementById('outDobNum').innerText = dobRaw;
    document.getElementById('outDobWords').innerText = dateToMarathi(dobRaw);
    document.getElementById('outBirthPlace').innerText = foundRow[5] || "";

    let today = new Date().toLocaleDateString('mr-IN');
    document.getElementById('currentDate').innerText = today;

    document.getElementById('lcCard').style.display = 'block';
    document.getElementById('printBtn').style.display = 'block';
}
