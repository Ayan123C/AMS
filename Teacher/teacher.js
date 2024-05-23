document.addEventListener("DOMContentLoaded", function () {
  const sidebarLinks = document.querySelectorAll(".sidebar a");

  sidebarLinks.forEach(link => {
      link.addEventListener("click", function (event) {
          event.preventDefault();
          sidebarLinks.forEach(item => item.classList.remove("active"));
          this.classList.add("active");
          const title = this.querySelector("h3").textContent;

          document.title = "Teacher | " + title;
      });
  });
});

const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");
const themeToggler = document.querySelector(".theme-toggler");

menuBtn.addEventListener("click", () => {
  sideMenu.style.display = "block";
});

closeBtn.addEventListener("click", () => {
  sideMenu.style.display = "none";
});

themeToggler.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme-variables");

  themeToggler.querySelector("span:nth-child(1)").classList.toggle("active");
  themeToggler.querySelector("span:nth-child(2)").classList.toggle("active");
});

const daysTag = document.querySelector(".days"),
  currentDate = document.querySelector(".current-date"),
  prevNextIcon = document.querySelectorAll(".icons span");

let date = new Date(),
  currYear = date.getFullYear(),
  currMonth = date.getMonth();

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const renderCalendar = () => {
  let firstDayOfMonth = new Date(currYear, currMonth, 1).getDay(),
    lastDateOfMonth = new Date(currYear, currMonth + 1, 0).getDate(),
    lastDayOfMonth = new Date(currYear, currMonth, lastDateOfMonth).getDay(),
    lastDateOfLastMonth = new Date(currYear, currMonth, 0).getDate();
  let liTag = "";

  for (let i = firstDayOfMonth; i > 0; i--) {
    liTag += `<li class="inactive">${lastDateOfLastMonth - i + 1}</li>`;
  }

  for (let i = 1; i <= lastDateOfMonth; i++) {
    let isToday =
      i === date.getDate() &&
      currMonth === new Date().getMonth() &&
      currYear === new Date().getFullYear()
        ? "active"
        : "";
    liTag += `<li class="${isToday}">${i}</li>`;
  }

  for (let i = lastDayOfMonth; i < 6; i++) {
    liTag += `<li class="inactive">${i - lastDayOfMonth + 1}</li>`;
  }
  currentDate.innerText = `${months[currMonth]} ${currYear}`;
  daysTag.innerHTML = liTag;
};
renderCalendar();

prevNextIcon.forEach((icon) => {
  icon.addEventListener("click", () => {
    currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

    if (currMonth < 0 || currMonth > 11) {
      date = new Date(currYear, currMonth, new Date().getDate());
      currYear = date.getFullYear();
      currMonth = date.getMonth();
    } else {
      date = new Date();
    }
    renderCalendar();
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const menuItems = document.querySelectorAll(".sidebar a");

  menuItems.forEach((item) => {
    item.addEventListener("click", function (event) {
      event.preventDefault();

      menuItems.forEach((item) => {
        item.classList.remove("active");
      });

      this.classList.add("active");

      const allContents = document.querySelectorAll(".content");
      allContents.forEach((content) => {
        content.style.display = "none";
      });

      const contentId = this.getAttribute("id").replace("-menu", "-content");
      const contentToShow = document.getElementById(contentId);
      if (contentToShow) {
        contentToShow.style.display = "block";
      }
    });
  });
});

document.querySelectorAll(".top #menu-btn").forEach((button) => {
  button.addEventListener("click", () => {
    sideMenu.style.display = "block";
  });
});

document.querySelectorAll(".top #close-btn").forEach((button) => {
  button.addEventListener("click", () => {
    sideMenu.style.display = "none";
  });
});

document.getElementById("logout-link").addEventListener("click", function (event) {
    event.preventDefault();
    localStorage.removeItem("token");
    window.location.href = this.getAttribute("href");
});

fetch("../json/updates.json")
  .then((response) => response.json())
  .then((data) => {
    const updatesContainer = document.querySelector(".recent-updates .updates");
    const showMoreLink = document.querySelector(".show-more a");

    data.sort((a, b) => {
      const dateA = new Date(a.timeAgo.split("-").reverse().join("-"));
      const dateB = new Date(b.timeAgo.split("-").reverse().join("-"));
      return dateB - dateA;
    });

    const latestUpdates = data.slice(0, 4);

    latestUpdates.forEach((update) => {
      const updateDiv = document.createElement("div");
      updateDiv.classList.add("update");

      const currentDate = new Date();
      const parts = update.timeAgo.split("-");
      const userDate = new Date(parts[2], parts[1] - 1, parts[0]);

      const timeDiff = currentDate.getTime() - userDate.getTime();
      const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hoursDiff = Math.floor(
        (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );

      updateDiv.innerHTML = `
                <div class="message">
                    <p><b>${update.title}</b> ${update.description}</p>
                    <small class="text-muted">${formatTimeAgo(
                      daysDiff,
                      hoursDiff
                    )}</small>
                </div>
            `;

      updatesContainer.appendChild(updateDiv);
    });

    showMoreLink.href = "Updates/updates.html";
  })
  .catch((error) => console.error("Error fetching data:", error));

function formatTimeAgo(days, hours) {
  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else {
    return "Just now";
  }
}

const showSuccessToast = (message) => {
  const toastContent = document.createElement("div");
  toastContent.classList.add("toast-content");

  const icon = document.createElement("i");
  icon.classList.add("fas", "fa-check-circle", "toast-icon");
  icon.style.paddingLeft = "10px";
  toastContent.appendChild(icon);

  const messageElement = document.createElement("span");
  messageElement.textContent = message;
  toastContent.appendChild(messageElement);

  const toast = Toastify({
    node: toastContent,
    duration: 3000,
    gravity: "top",
    position: "center",
    backgroundColor: "green",
    progressBar: true,
    style: {
      padding: "20px 2px",
      borderRadius: "8px",
    },
  });

  const setToastWidth = () => {
    const messageWidth = message.length * 10;
    toast.options.style.maxWidth = `${messageWidth}px`;

    if (window.innerWidth <= 768) {
      toast.options.style.margin = "0 15px";
    }
  };

  setToastWidth();

  window.addEventListener("resize", setToastWidth);

  toast.showToast();
};

const showErrorToast = (message) => {
  const toastContent = document.createElement("div");
  toastContent.classList.add("toast-content");

  const icon = document.createElement("i");
  icon.classList.add("fas", "fa-exclamation-circle", "toast-icon");
  icon.style.paddingLeft = "10px";
  toastContent.appendChild(icon);

  const messageElement = document.createElement("span");
  messageElement.textContent = message;
  toastContent.appendChild(messageElement);

  const toast = Toastify({
    node: toastContent,
    duration: 3000,
    gravity: "top",
    position: "center",
    backgroundColor: "red",
    progressBar: true,
    style: {
      padding: "20px 2px",
      borderRadius: "8px",
    },
  });

  const setToastWidth = () => {
    const messageWidth = message.length * 10;
    toast.options.style.maxWidth = `${messageWidth}px`;

    if (window.innerWidth <= 768) {
      toast.options.style.margin = "0 15px";
    }
  };

  setToastWidth();

  window.addEventListener("resize", setToastWidth);

  toast.showToast();
};

const showWarningToast = (message) => {
  const toastContent = document.createElement("div");
  toastContent.classList.add("toast-content");

  const icon = document.createElement("i");
  icon.classList.add("fas", "fa-exclamation-triangle", "toast-icon");
  icon.style.paddingLeft = "10px";
  toastContent.appendChild(icon);

  const messageElement = document.createElement("span");
  messageElement.textContent = message;
  toastContent.appendChild(messageElement);

  const toast = Toastify({
    node: toastContent,
    duration: 3000,
    gravity: "top",
    position: "center",
    backgroundColor: "#f1a90f",
    progressBar: true,
    style: {
      padding: "20px 2px",
      borderRadius: "8px",
    },
  });

  const setToastWidth = () => {
    const messageWidth = message.length * 10;
    toast.options.style.maxWidth = `${messageWidth}px`;

    if (window.innerWidth <= 768) {
      toast.options.style.margin = "0 15px";
    }
  };

  setToastWidth();

  window.addEventListener("resize", setToastWidth);

  toast.showToast();
};

document.addEventListener("DOMContentLoaded", () => {
  const attendanceForm = document.getElementById("attendanceForm");
  const studentAttendanceForm = document.getElementById("studentAttendanceForm");
  const giveAttendendanceForm1 = document.getElementById("giveAttendendanceForm1");
  const giveAttendendanceForm2 = document.getElementById("giveAttendendanceForm2");
  const studentAttendanceReport = document.querySelector(".student-attendance-report");
  const giveAttendanceReport = document.querySelector(".give-attendance-report");
  const rollNumberInput = document.getElementById("rollNumber");
  const dateInput = document.getElementById("date");
  const subjectSelect = document.getElementById("subject");
  const warningMessage = document.getElementById("warningMessage");

  const showToast = (message) => {
    Toastify({
      text: message,
      duration: 3000,
      gravity: "top",
      position: "center",
      backgroundColor: "#4CAF50",
    }).showToast();
  };

  const showErrorToast = (message) => {
    Toastify({
      text: message,
      duration: 3000,
      gravity: "top",
      position: "center",
      backgroundColor: "#f44336",
    }).showToast();
  };

  attendanceForm.addEventListener("click", (event) => {
    if (event.target.tagName === "BUTTON") {
      event.preventDefault();
      const action = event.target.value;
      if (action === "studentAttendance") {
        attendanceForm.style.display = "none";
        studentAttendanceForm.style.display = "block";
      } else if (action === "giveAttendendance") {
        attendanceForm.style.display = "none";
        giveAttendendanceForm1.style.display = "block";
      }
    }
  });

  studentAttendanceForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!rollNumberInput.value) {
      showErrorToast("Please enter the roll number");
    } else {
      studentAttendanceForm.style.display = "none";
      studentAttendanceReport.style.display = "block";
      document.getElementById("student-attendance-report-roll").textContent = rollNumberInput.value;
      const tableBody = document.getElementById("student-attendance-tableBody");
      tableBody.innerHTML = "";
      for (let i = 1; i <= 20; i++) {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = `CS${600 + i}`;
        row.insertCell(1).textContent = `Subject ${i}`;
        row.insertCell(2).textContent = Math.floor(Math.random() * 50) + 1;
        row.insertCell(3).textContent = Math.floor(Math.random() * 50) + 1;
        row.insertCell(4).textContent = Math.floor(Math.random() * 100) + "%";
      }
      showToast("Report successfully generated");
    }
  });

  studentAttendanceForm.querySelector('button[type="reset"]').addEventListener("click", () => {
    studentAttendanceForm.style.display = "none";
    attendanceForm.style.display = "block";
  });

  giveAttendendanceForm1.addEventListener("submit", async (event) => {
    event.preventDefault();
    const dateValue = document.getElementById("date").value;
    if (!dateValue) {
      showErrorToast("Please enter a date");
    } else {
      try {
        const selectedDate = new Date(dateValue);
        const dayOfWeek = selectedDate.toLocaleDateString("en-US", { weekday: "long" });
        const accessToken = localStorage.getItem("access_token");
        const userId = localStorage.getItem("userId");
        if (!accessToken || !userId) {
          showErrorToast("Access token or user ID not found");
          return;
        }
        const url = `http://localhost:8080/routine/subject/all?day=${dayOfWeek}&teacherId=${userId}`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.ok) {
          const responseData = await response.json();
          window.subjectDetails = responseData.subjectList;
          subjectSelect.innerHTML = '<option value="">Search</option>';
          responseData.subjectList.forEach((subject, index) => {
            const option = document.createElement("option");
            let optionText = "";
            if (subject.accessType === "S") {
              optionText = `SUB ${subject.subCode} ${subject.subName} (${subject.sem}${subject.section}`;
              if (subject.classType === "Flip") {
                optionText += " - Flip";
              }
              optionText += ")";
              option.style.color = "red";
            } else {
              optionText = `${subject.subCode} ${subject.subName} (${subject.sem}${subject.section}`;
              if (subject.classType === "Flip") {
                optionText += " - Flip";
              }
              optionText += ")";
            }
            option.value = index;
            option.textContent = optionText;
            subjectSelect.appendChild(option);
          });
          document.getElementById("giveAttendendanceForm1").style.display = "none";
          document.getElementById("giveAttendendanceForm2").style.display = "block";
        } else {
          showErrorToast("Failed to fetch data from the server");
        }
      } catch (error) {
        console.error("Error:", error);
        showErrorToast("An error occurred while processing the request");
      }
    }
  });

  document.getElementById("giveAttendendanceForm2").addEventListener("submit", async (event) => {
    event.preventDefault();
    const subjectSelect = document.getElementById("subject");
    if (!subjectSelect.value) {
      showErrorToast("Please select a subject");
    } else {
      const selectedIndex = subjectSelect.value;
      const selectedSubject = window.subjectDetails[selectedIndex];
      const batch = selectedSubject.batch;
      const semester = selectedSubject.sem;
      const section = selectedSubject.section;
      const date = document.getElementById("date").value;
      const subCode = selectedSubject.subCode;
      const subName = selectedSubject.subName;
      const accessType = selectedSubject.accessType;
      const classType = selectedSubject.classType;
      document.getElementById("reportBatch").textContent = batch;
      document.getElementById("reportSemester").textContent = semester;
      document.getElementById("reportSection").textContent = section;
      document.getElementById("reportSubject").textContent = `${subCode} ${subName}`;
      document.getElementById("reportDate").textContent = date;
      const attendanceUrl = `http://localhost:8080/attendance?batch=${batch}&section=${section}&date=${date}&subCode=${subCode}&classType=${classType}`;
      try {
        const attendanceResponse = await fetch(attendanceUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        if (attendanceResponse.ok) {
          const data = await attendanceResponse.json();
          const tbody = document.querySelector("#data-table tbody");
          tbody.innerHTML = "";
          data.presentStatusResponseList.forEach((student) => {
            const row = document.createElement("tr");
            row.innerHTML = `
              <td>${student.collegeId}</td>
              <td>${student.rollNo}</td>
              <td>${student.name}</td>
              <td><input type="checkbox" ${student.status ? "checked" : ""}></td>
              <td>${student.totalPresentClass}</td>
              <td>${student.percentage}</td>
            `;
            row.dataset.collegeId = student.collegeId;
            tbody.appendChild(row);
          });
          showSuccessToast("Attendance logged successfully.");
        } else {
          showErrorToast("Failed to fetch attendance data.");
        }
      } catch (error) {
        console.error("Error logging attendance:", error);
        showErrorToast("Error logging attendance. Please try again.");
      }
  
      giveAttendanceReport.style.display = "block";
      giveAttendendanceForm2.style.display = "none";
    }
  });  

  document.getElementById("submitattendence").addEventListener("submit", async (event) => {
    event.preventDefault();
  
    const presentStatusRequests = [];
  
    document.querySelectorAll("#data-table input[type='checkbox']").forEach((checkbox) => {
      presentStatusRequests.push({
        collegeId: checkbox.closest("tr").dataset.collegeId,
        status: checkbox.checked,
      });
    });
  
    const selectedIndex = subjectSelect.value;
    const selectedSubject = window.subjectDetails[selectedIndex];
  
    const batch = selectedSubject.batch;
    const section = selectedSubject.section;
    const date = document.getElementById("reportDate").textContent;
    const subCode = selectedSubject.subCode;
    const classType = selectedSubject.classType;
  
    const requestBody = {
      batch: batch,
      section: section,
      subCode: subCode,
      date: date,
      classType: classType,
      presentStatusRequests: presentStatusRequests,
    };
  
    try {
      const postResponse = await fetch("http://localhost:8080/attendance", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      if (postResponse.ok) {
        showSuccessToast("Attendance submitted successfully.");
      } else {
        showErrorToast("Failed to submit attendance. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting attendance:", error);
      showErrorToast("Error submitting attendance. Please try again.");
    }
  });  

  giveAttendendanceForm1
    .querySelector('button[type="reset"]')
    .addEventListener("click", () => {
      giveAttendendanceForm1.style.display = "none";
      attendanceForm.style.display = "block";
    });

  giveAttendendanceForm2
    .querySelector('button[type="reset"]')
    .addEventListener("click", () => {
      giveAttendendanceForm2.style.display = "none";
      giveAttendendanceForm1.style.display = "block";
    });

  giveAttendanceReport
    .querySelector('button[type="reset"]')
    .addEventListener("click", () => {
      giveAttendanceReport.style.display = "none";
      giveAttendendanceForm2.style.display = "block";
    });

  document
    .querySelector('.give-attendance-report .attendanceBtn[type="button"]')
    .addEventListener("click", () => {
      giveAttendanceReport.style.display = "none";
      attendanceForm.style.display = "block";
    });

  document
    .querySelector('.student-attendance-report .attendanceBtn[type="button"]')
    .addEventListener("click", () => {
      studentAttendanceReport.style.display = "none";
      attendanceForm.style.display = "block";
    });

  rollNumberInput.addEventListener("input", () => {
    if (isNaN(rollNumberInput.value)) {
      warningMessage.style.display = "inline";
    } else {
      warningMessage.style.display = "none";
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const substituteForm = document.getElementById("substituteForm");
  const substituteSubject = document.getElementById("substitute-subject");
  const substituteTeacher = document.getElementById("substitute-teacher");
  const substituteReport = document.querySelector(".substitute-report");
  const substituteReportSubjectName = document.getElementById("substitute-reportSubjectName");
  const substituteReportSubjectCode = document.getElementById("substitute-reportSubjectCode");
  const substituteReportTeacherName = document.getElementById("substitute-reportTeacherName");

  substituteForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const selectedSubject = substituteSubject.value;
    const selectedTeacher = substituteTeacher.value;

    if (!selectedSubject || !selectedTeacher) {
      Toastify({
        text: "Please fill in both subject and teacher fields.",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "#f44336",
        stopOnFocus: true,
      }).showToast();
    } else {
      const subjectParts = selectedSubject.split(" ", 2);
      const subjectCode = subjectParts[0];
      const subjectName = selectedSubject.slice(subjectCode.length).trim();

      substituteReportSubjectName.textContent = subjectName;
      substituteReportSubjectCode.textContent = subjectCode;
      substituteReportTeacherName.textContent = selectedTeacher;

      substituteForm.style.display = "none";
      substituteReport.style.display = "block";
    }
  });

  substituteReport.querySelector("button").addEventListener("click", () => {
    substituteForm.style.display = "block";
    substituteReport.style.display = "none";
    substituteForm.reset();
  });
});

document.addEventListener("DOMContentLoaded", function () {
  var form1 = document.getElementById("medicalAttendenceForm1");
  var form2 = document.getElementById("medicalAttendenceForm2");
  var contentDiv = document.getElementById("medical-attendence-content");
  var reportDiv = contentDiv.querySelector(".medical-attendence-report");
  var tableBody = document.getElementById("medical-attendance-tableBody");

  function redirectToForm2() {
    form1.style.display = "none";
    form2.style.display = "block";
  }

  // Function to fetch subjects from JSON file based on the collegeId
  function fetchSubjects() {
    var collegeId = document.getElementById("medical-attendance").value;
    // Assuming the JSON file is named 'medicalAttendenceSubjects.json' and is in the same directory
    fetch("../json/medicalAttendenceSubjects.json")
      .then((response) => response.json())
      .then((data) => {
        var subjectOptions = '<option value="">Search</option>';
        if (data[collegeId] && data[collegeId].subjects) {
          data[collegeId].subjects.forEach((subject) => {
            subjectOptions +=
              '<option value="' + subject + '">' + subject + "</option>";
          });
          document.getElementById("medical-attendence-subject").innerHTML =
            subjectOptions;
          redirectToForm2();
        } else {
          Toastify({
            text: "Subjects not found for the given College ID",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "#f44336",
            stopOnFocus: true,
          }).showToast();
        }
      })
      .catch((error) => {
        console.error("Error fetching the subjects:", error);
        Toastify({
          text: "Error fetching the subjects",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "#f44336",
          stopOnFocus: true,
        }).showToast();
      });
  }

  // Function to fetch attendance data based on the selected subject
  function fetchAttendanceData(subjectId) {
    // Assuming the attendance data is fetched from a server-side API
    // Here we simulate the fetch with static data for demonstration
    // Replace this with actual API call
    return new Promise((resolve) => {
      var attendanceData = [
        { date: "2024-01-01", status: "Present", classType: "Lecture" },
        { date: "2024-01-02", status: "Absent", classType: "Lab" },
        { date: "2024-01-03", status: "Present", classType: "Lecture" },
        { date: "2024-01-04", status: "Present", classType: "Lecture" },
        { date: "2024-01-05", status: "Absent", classType: "Lab" },
        { date: "2024-01-06", status: "Present", classType: "Lecture" },
        { date: "2024-01-07", status: "Present", classType: "Lecture" },
        { date: "2024-01-08", status: "Absent", classType: "Lab" },
        { date: "2024-01-09", status: "Present", classType: "Lecture" },
        { date: "2024-01-10", status: "Present", classType: "Lecture" },
      ];
      resolve(attendanceData);
    });
  }

  // Function to generate the report
  function generateReport() {
    var subjectId = document.getElementById("medical-attendence-subject").value;
    if (!subjectId) {
      Toastify({
        text: "Please select a subject",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "#f44336",
        stopOnFocus: true,
      }).showToast();
      return;
    }

    // Assuming the report details are fetched from a server-side API or database
    // For simplicity, let's just simulate the report data
    var reportData = {
      batch: "Batch 1",
      semester: "Semester 1",
      section: "Section A",
      subject: subjectId, // use the selected subject
      teacher: "Mr. Smith",
    };

    // Update the report details in the content div
    document.getElementById("medical-attendence-reportBatch").innerHTML =
      reportData.batch;
    document.getElementById("medical-attendence-reportSemester").innerHTML =
      reportData.semester;
    document.getElementById("medical-attendence-reportSection").innerHTML =
      reportData.section;
    document.getElementById("medical-attendence-reportSubject").innerHTML =
      reportData.subject;
    document.getElementById("medical-attendence-reportTeacher").innerHTML =
      reportData.teacher;

    // Fetch and populate the table with dynamic data
    fetchAttendanceData(subjectId).then(populateTable);

    // Show the report div
    reportDiv.style.display = "block";
    // Hide form2
    form2.style.display = "none";
  }

  // Function to populate the table with dynamic data
  function populateTable(attendanceData) {
    // Clear existing table data
    tableBody.innerHTML = "";

    // Populate table with dynamic data
    attendanceData.forEach(function (rowData) {
      var row = document.createElement("tr");
      var dateCell = document.createElement("td");
      var statusCell = document.createElement("td");
      var classTypeCell = document.createElement("td");

      dateCell.textContent = rowData.date;
      statusCell.innerHTML =
        '<input type="checkbox" ' +
        (rowData.status === "Present" ? "checked" : "") +
        ">";
      classTypeCell.textContent = rowData.classType;

      row.appendChild(dateCell);
      row.appendChild(statusCell);
      row.appendChild(classTypeCell);
      tableBody.appendChild(row);
    });
  }

  // Function to redirect back to form1 when cancel button is clicked
  function cancelForm2() {
    form2.style.display = "none";
    form1.style.display = "block";
  }

  // Function to redirect back to form1 when home button is clicked
  function redirectToForm1() {
    reportDiv.style.display = "none";
    form1.style.display = "block";
  }

  // Function to check if form details are filled before submitting
  function validateForm1() {
    var collegeId = document.getElementById("medical-attendance").value;
    if (collegeId === "") {
      Toastify({
        text: "Please enter the college Id",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "#f44336",
        stopOnFocus: true,
      }).showToast();
      return false;
    }
    return true;
  }

  // Function to check if subject is selected before submitting
  function validateForm2() {
    var subject = document.getElementById("medical-attendence-subject").value;
    if (subject === "") {
      Toastify({
        text: "Please select a subject",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "#f44336",
        stopOnFocus: true,
      }).showToast();
      return false;
    }
    return true;
  }

  // Add event listeners to the forms
  form1.addEventListener("submit", function (event) {
    event.preventDefault();
    if (validateForm1()) {
      fetchSubjects();
    }
  });

  form2.addEventListener("submit", function (event) {
    event.preventDefault();
    if (validateForm2()) {
      generateReport();
    }
  });

  form2
    .querySelector('.medicalAttendenceBtn[type="reset"]')
    .addEventListener("click", cancelForm2);

  // Add event listener to the home button in the report div
  reportDiv
    .querySelector('.medicalAttendenceBtn[type="button"]')
    .addEventListener("click", redirectToForm1);
});

function setMaxDate() {
  var now = new Date(); // Current UTC date and time
  var istOffset = 330; // IST offset in minutes (+5:30)
  now.setMinutes(now.getMinutes() + istOffset); // Convert UTC to IST

  var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  var tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1); // Increment the day by 1

  document.getElementById("date").max = tomorrow.toISOString().split("T")[0];
}

document.addEventListener("DOMContentLoaded", setMaxDate);
