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

document
  .getElementById("logout-link")
  .addEventListener("click", function (event) {
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

document.addEventListener('DOMContentLoaded', () => {
  const attendanceForm = document.getElementById('attendanceForm');
  const studentAttendanceForm = document.getElementById('studentAttendanceForm');
  const giveAttendendanceForm1 = document.getElementById('giveAttendendanceForm1');
  const giveAttendendanceForm2 = document.getElementById('giveAttendendanceForm2');
  const studentAttendanceReport = document.querySelector('.student-attendance-report');
  const giveAttendanceReport = document.querySelector('.give-attendance-report');
  const rollNumberInput = document.getElementById('rollNumber');
  const dateInput = document.getElementById('date');
  const subjectSelect = document.getElementById('subject');
  const warningMessage = document.getElementById('warningMessage');

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

  attendanceForm.addEventListener('click', (event) => {
      if (event.target.tagName === 'BUTTON') {
          event.preventDefault();
          const action = event.target.value;
          if (action === 'studentAttendance') {
              attendanceForm.style.display = 'none';
              studentAttendanceForm.style.display = 'block';
          } else if (action === 'giveAttendendance') {
              attendanceForm.style.display = 'none';
              giveAttendendanceForm1.style.display = 'block';
          }
      }
  });

  studentAttendanceForm.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!rollNumberInput.value) {
          showErrorToast("Please enter the roll number");
      } else {
          studentAttendanceForm.style.display = 'none';
          studentAttendanceReport.style.display = 'block';
          document.getElementById('student-attendance-report-roll').textContent = rollNumberInput.value;
          // Populate the attendance table with 20 dummy rows
          const tableBody = document.getElementById('student-attendance-tableBody');
          tableBody.innerHTML = '';
          for (let i = 1; i <= 20; i++) {
              const row = tableBody.insertRow();
              row.insertCell(0).textContent = `CS${600 + i}`;
              row.insertCell(1).textContent = `Subject ${i}`;
              row.insertCell(2).textContent = Math.floor(Math.random() * 50) + 1;
              row.insertCell(3).textContent = Math.floor(Math.random() * 50) + 1;
              row.insertCell(4).textContent = Math.floor(Math.random() * 100) + '%';
          }
          showToast("Report successfully generated");
      }
  });

  studentAttendanceForm.querySelector('button[type="reset"]').addEventListener('click', () => {
      studentAttendanceForm.style.display = 'none';
      attendanceForm.style.display = 'block';
  });

  giveAttendendanceForm1.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!dateInput.value) {
          showErrorToast("Please enter a date");
      } else {
          giveAttendendanceForm1.style.display = 'none';
          giveAttendendanceForm2.style.display = 'block';
      }
  });

  giveAttendendanceForm1.querySelector('button[type="reset"]').addEventListener('click', () => {
      giveAttendendanceForm1.style.display = 'none';
      attendanceForm.style.display = 'block';
  });

  giveAttendendanceForm2.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!subjectSelect.value) {
          showErrorToast("Please select a subject");
      } else {
          giveAttendendanceForm2.style.display = 'none';
          giveAttendanceReport.style.display = 'block';
          document.getElementById('reportDate').textContent = dateInput.value;
          document.getElementById('reportSubject').textContent = subjectSelect.value;
          // Populate the attendance report table with 20 dummy rows
          const dataTableBody = document.getElementById('data-table').getElementsByTagName('tbody')[0];
          dataTableBody.innerHTML = '';
          for (let i = 1; i <= 20; i++) {
              const row = dataTableBody.insertRow();
              row.insertCell(0).textContent = `ID${1000 + i}`;
              row.insertCell(1).textContent = `Roll${i}`;
              row.insertCell(2).textContent = `Student ${i}`;
              const attendanceCell = row.insertCell(3);
              const checkbox = document.createElement('input');
              checkbox.type = 'checkbox';
              checkbox.checked = Math.random() > 0.5; // Randomly set some checkboxes as checked
              attendanceCell.appendChild(checkbox);
              row.insertCell(4).textContent = Math.floor(Math.random() * 50) + 1;
              row.insertCell(5).textContent = Math.floor(Math.random() * 100) + '%';
          }
      }
  });

  giveAttendendanceForm2.querySelector('button[type="reset"]').addEventListener('click', () => {
      giveAttendendanceForm2.style.display = 'none';
      giveAttendendanceForm1.style.display = 'block';
  });

  giveAttendanceReport.querySelector('button[type="reset"]').addEventListener('click', () => {
      giveAttendanceReport.style.display = 'none';
      giveAttendendanceForm2.style.display = 'block';
  });

  document.querySelector('.give-attendance-report .attendanceBtn[type="button"]').addEventListener('click', () => {
      giveAttendanceReport.style.display = 'none';
      attendanceForm.style.display = 'block';
  });

  document.querySelector('.student-attendance-report .attendanceBtn[type="button"]').addEventListener('click', () => {
      studentAttendanceReport.style.display = 'none';
      attendanceForm.style.display = 'block';
  });

  giveAttendanceReport.addEventListener('submit', (event) => {
      event.preventDefault();
      showToast("Form successfully submitted");
  });

  rollNumberInput.addEventListener('input', () => {
      if (isNaN(rollNumberInput.value)) {
          warningMessage.style.display = 'inline';
      } else {
          warningMessage.style.display = 'none';
      }
  });
});


//Old ManageAttendence js:-
// document.addEventListener("DOMContentLoaded", () => {
//   const attendanceForm = document.getElementById("attendanceForm");
//   const studentAttendanceForm = document.getElementById(
//     "studentAttendanceForm"
//   );
//   const giveAttendendanceForm1 = document.getElementById(
//     "giveAttendendanceForm1"
//   );
//   const giveAttendendanceForm2 = document.getElementById(
//     "giveAttendendanceForm2"
//   );

//   const studentAttendanceReport = document.querySelector(
//     ".student-attendance-report"
//   );
//   const giveAttendanceReport = document.querySelector(
//     ".give-attendance-report"
//   );

//   const rollNumberInput = document.getElementById("rollNumber");
//   const subjectSelect = document.getElementById("subject");

//   const attendanceTableBody = document
//     .getElementById("attendanceTable")
//     .getElementsByTagName("tbody")[0];

//   const homeButtonStudent = document.querySelector(
//     ".student-attendance-report .attendanceBtn"
//   );
//   const homeButtonGiveAttendance = document.querySelector(
//     ".give-attendance-report .attendanceBtn"
//   );

//   const cancelButtons = document.querySelectorAll(
//     '.attendanceBtn[type="reset"]'
//   );

//   attendanceForm.addEventListener("click", (event) => {
//     event.preventDefault();
//     const targetBtn = event.target;
//     const action = targetBtn.value;

//     attendanceForm.style.display = "none";

//     if (action === "studentAttendance") {
//       studentAttendanceForm.style.display = "block";
//     } else if (action === "giveAttendendance") {
//       giveAttendendanceForm1.style.display = "block";
//     }
//   });

//   studentAttendanceForm.addEventListener("submit", async (event) => {
//     event.preventDefault();
//     const rollNumber = rollNumberInput.value.trim();

//     try {
//       const response = await fetch(
//         `http://localhost:8080/attendance/admin/collegeId/${rollNumber}`
//       );
//       const data = await response.json();

//       const {
//         name,
//         rollNo,
//         collegeId,
//         batch,
//         sem,
//         section,
//         studentSubjectAttendanceResponseList,
//       } = data;

//       document.getElementById("student-attendance-report-name").textContent =
//         name;
//       document.getElementById("student-attendance-report-roll").textContent =
//         rollNo;
//       document.getElementById(
//         "student-attendance-report-collegeId"
//       ).textContent = collegeId;
//       document.getElementById("student-attendance-report-batch").textContent =
//         batch;
//       document.getElementById(
//         "student-attendance-report-semester"
//       ).textContent = sem;
//       document.getElementById("student-attendance-report-section").textContent =
//         section;

//       const tbody = document.getElementById("student-attendance-tableBody");
//       tbody.innerHTML = "";

//       studentSubjectAttendanceResponseList.forEach((subject) => {
//         const row = tbody.insertRow();
//         const subjectCell = row.insertCell(0);
//         const subjectNameCell = row.insertCell(1);
//         const totalClassCell = row.insertCell(2);
//         const presentClassCell = row.insertCell(3);
//         const percentageCell = row.insertCell(4);

//         subjectCell.textContent = subject.subCode;
//         subjectNameCell.textContent = subject.subName;
//         totalClassCell.textContent = subject.totalClass;
//         presentClassCell.textContent = subject.presentClass;
//         percentageCell.textContent = subject.percentage;
//       });

//       studentAttendanceReport.style.display = "block";
//       studentAttendanceForm.style.display = "none";
//     } catch (error) {
//       console.error("Error fetching student details:", error);
//       alert("Error fetching student details. Please try again later.");
//     }
//   });

//   let selectedBatch = "";
//   let selectedSemester = "";
//   let selectedSection = "";

//   giveAttendendanceForm1.addEventListener("submit", async (event) => {
//     event.preventDefault();
//     const formData = new FormData(event.target);
//     selectedBatch = formData.get("batch");
//     selectedSemester = formData.get("semester");
//     selectedSection = formData.get("section");

//     if (!selectedBatch || !selectedSemester || !selectedSection) {
//       showWarningToast("Please select batch, semester, and section.");
//       return;
//     }

//     try {
//       const response = await fetch(
//         `http://localhost:8080/subject?batch=${selectedBatch}&sem=${selectedSemester}`
//       );
//       const data = await response.json();

//       if (Array.isArray(data) && data.length > 0) {
//         data.forEach((subject) => {
//           const option = document.createElement("option");
//           option.value = subject.subCode;
//           option.textContent = subject.subCode + "  " + subject.subName;
//           subjectSelect.appendChild(option);
//         });

//         // Update the section in the attendance report
//         document.getElementById("reportSection").textContent = selectedSection;

//         giveAttendendanceForm1.style.display = "none";
//         giveAttendendanceForm2.style.display = "block";
//       } else {
//         showErrorToast(
//           "Subjects not found for the selected batch and semester."
//         );
//       }
//     } catch (error) {
//       console.error("Error fetching subjects:", error);
//       showErrorToast("Error fetching subjects. Please try again later.");
//     }
//   });

//   giveAttendendanceForm2.addEventListener("submit", async (event) => {
//     event.preventDefault();
//     const formData = new FormData(event.target);
//     const subject = formData.get("subject");
//     const date = formData.get("date");

//     if (!subject || !date) {
//       showWarningToast("Please select subject and date.");
//       return;
//     }

//     try {
//       reportBatch.textContent = selectedBatch;
//       reportSemester.textContent = selectedSemester;
//       reportSection.textContent = selectedSection;
//       reportSubject.textContent = subject;
//       reportDate.textContent = date;

//       // Fetch attendance data from the API
//       const url = `http://localhost:8080/attendance?batch=${selectedBatch}&section=${selectedSection}&date=${date}&subCode=${subject}`;
//       const response = await fetch(url);
//       const data = await response.json();

//       // Update the table with attendance data
//       const tbody = document.querySelector("#data-table tbody");
//       tbody.innerHTML = ""; // Clear existing rows
//       data.presentStatusResponseList.forEach((student) => {
//         const row = document.createElement("tr");
//         row.innerHTML = `
//           <td>${student.collegeId}</td>
//           <td>${student.rollNo}</td>
//           <td>${student.name}</td>
//           <td><input type="checkbox" ${student.status ? "checked" : ""}></td>
//           <td>${student.totalPresentClass}</td>
//           <td>${student.percentage}</td>
//         `;
//         row.dataset.collegeId = student.collegeId; // Add collegeId as dataset
//         tbody.appendChild(row);
//       });

//       showSuccessToast("Attendance logged successfully.");
//     } catch (error) {
//       console.error("Error logging attendance:", error);
//       showErrorToast("Error logging attendance. Please try again.");
//     }

//     giveAttendanceReport.style.display = "block";
//     giveAttendendanceForm2.style.display = "none";
//   });

//   // Add event listener for form submission to send data to the server
//   giveAttendanceReport.addEventListener("submit", async (event) => {
//     event.preventDefault();

//     const presentStatusRequests = [];

//     // Iterate over checkboxes to gather updated data
//     document
//       .querySelectorAll("#data-table input[type='checkbox']")
//       .forEach((checkbox) => {
//         presentStatusRequests.push({
//           collegeId: checkbox.closest("tr").dataset.collegeId,
//           status: checkbox.checked,
//         });
//       });

//     const requestBody = {
//       batch: selectedBatch,
//       section: selectedSection,
//       subCode: reportSubject.textContent,
//       date: reportDate.textContent,
//       presentStatusRequests: presentStatusRequests,
//     };

//     try {
//       const postResponse = await fetch("http://localhost:8080/attendance", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(requestBody),
//       });

//       if (postResponse.ok) {
//         showSuccessToast("Attendance submitted successfully.");
//       } else {
//         showErrorToast("Failed to submit attendance. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error submitting attendance:", error);
//       showErrorToast("Error submitting attendance. Please try again.");
//     }
//   });

//   homeButtonStudent.addEventListener("click", () => {
//     location.reload();
//   });

//   homeButtonGiveAttendance.addEventListener("click", () => {
//     location.reload();
//   });

//   cancelButtons.forEach((button) => {
//     button.addEventListener("click", (event) => {
//       event.preventDefault();
//       attendanceForm.style.display = "inherit";
//       studentAttendanceForm.style.display = "none";
//       giveAttendendanceForm1.style.display = "none";
//       giveAttendendanceForm2.style.display = "none";

//       studentAttendanceForm.reset();
//       giveAttendendanceForm1.reset();
//       giveAttendendanceForm2.reset();
//     });
//   });
// });

document.addEventListener("DOMContentLoaded", function() {
  const substituteForm = document.getElementById('substituteForm');
  const substituteSubject = document.getElementById('substitute-subject');
  const substituteTeacher = document.getElementById('substitute-teacher');
  const substituteReport = document.querySelector('.substitute-report');
  const substituteReportSubjectName = document.getElementById('substitute-reportSubjectName');
  const substituteReportSubjectCode = document.getElementById('substitute-reportSubjectCode');
  const substituteReportTeacherName = document.getElementById('substitute-reportTeacherName');

  substituteForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from submitting normally

    const selectedSubject = substituteSubject.value;
    const selectedTeacher = substituteTeacher.value;

    if (!selectedSubject || !selectedTeacher) {
      // Show Toastify message if fields are empty
      Toastify({
        text: "Please fill in both subject and teacher fields.",
        duration: 3000,
        close: true,
        gravity: "top", // top or bottom
        position: "center", // left, center, or right
        backgroundColor: "#f44336",
        stopOnFocus: true // Prevents dismissing of toast on hover
      }).showToast();
    } else {
      // Extracting Subject Name and Code from selectedSubject value
      const subjectParts = selectedSubject.split(' ', 2);
      const subjectCode = subjectParts[0];
      const subjectName = selectedSubject.slice(subjectCode.length).trim();

      // Display the report with selected values
      substituteReportSubjectName.textContent = subjectName;
      substituteReportSubjectCode.textContent = subjectCode;
      substituteReportTeacherName.textContent = selectedTeacher;

      // Hide the form and show the report
      substituteForm.style.display = 'none';
      substituteReport.style.display = 'block';
    }
  });

  // Handle "Home" button click to go back to the form
  substituteReport.querySelector('button').addEventListener('click', function() {
    substituteForm.style.display = 'block';
    substituteReport.style.display = 'none';
    substituteForm.reset();
  });
});

//Old SubstituteFaculty js:-

// document.addEventListener("DOMContentLoaded", () => {
//   const substituteForm1 = document.getElementById("substituteForm1");
//   const substituteForm2 = document.getElementById("substituteForm2");
//   const substituteSelectTeacher = document.getElementById("substitute-teacher");
//   const substituteSelectSubject = document.getElementById("substitute-subject");
//   const substituteReportBatch = document.getElementById(
//     "substitute-reportBatch"
//   );
//   const substituteReportSemester = document.getElementById(
//     "substitute-reportSemester"
//   );
//   const substituteReportSection = document.getElementById(
//     "substitute-reportSection"
//   );
//   const substituteReportSubject = document.getElementById(
//     "substitute-reportSubject"
//   );
//   const substituteReportTeacher = document.getElementById(
//     "substitute-reportTeacher"
//   );
//   const substituteReportDiv = document.querySelector(".substitute-report");
//   const substituteHomeButton = document.querySelector(
//     ".substitute-report .substituteBtn"
//   );

//   let selectedSubstituteBatch = "";
//   let selectedSubstituteSemester = "";

//   fetch("../json/teachers.json")
//     .then((response) => response.json())
//     .then((data) => {
//       data.forEach((teacher) => {
//         const option = document.createElement("option");
//         option.value = teacher.id;
//         option.textContent = teacher.name;
//         substituteSelectTeacher.appendChild(option);
//       });
//     });

//   substituteForm1.addEventListener("submit", async (event) => {
//     event.preventDefault();
//     const formData = new FormData(event.target);
//     selectedSubstituteBatch = formData.get("batch");
//     selectedSubstituteSemester = formData.get("semester");

//     if (!selectedSubstituteBatch || !selectedSubstituteSemester) {
//       alert("Please select both batch and semester.");
//       return;
//     }

//     try {
//       const response = await fetch("../json/subjects.json");
//       const data = await response.json();

//       if (
//         data.hasOwnProperty(selectedSubstituteBatch) &&
//         data[selectedSubstituteBatch].hasOwnProperty(selectedSubstituteSemester)
//       ) {
//         const subjects =
//           data[selectedSubstituteBatch][selectedSubstituteSemester];
//         substituteSelectSubject.innerHTML = "";

//         subjects.forEach((subject) => {
//           const option = document.createElement("option");
//           option.value = subject;
//           option.textContent = subject;
//           substituteSelectSubject.appendChild(option);
//         });

//         substituteForm1.style.display = "none";
//         substituteForm2.style.display = "block";
//       } else {
//         alert("Subjects not found for the selected batch and semester.");
//       }
//     } catch (error) {
//       console.error("Error fetching subjects:", error);
//       alert("Error fetching subjects. Please try again later.");
//     }
//   });

//   substituteForm2.addEventListener("submit", (event) => {
//     event.preventDefault();
//     const formData = new FormData(event.target);
//     const section = formData.get("section");
//     const subject = formData.get("subject");
//     const teacherId = formData.get("teacher");

//     if (!section || !subject || !teacherId) {
//       alert("Please select section, subject, and teacher.");
//       return;
//     }

//     try {
//       const teacherSelect = document.getElementById("substitute-teacher");
//       const selectedTeacher = teacherSelect.querySelector(
//         `option[value="${teacherId}"]`
//       ).textContent;

//       substituteReportBatch.textContent = selectedSubstituteBatch;
//       substituteReportSemester.textContent = selectedSubstituteSemester;
//       substituteReportSection.textContent = section;
//       substituteReportSubject.textContent = subject;
//       substituteReportTeacher.textContent = selectedTeacher;

//       alert("Successfully assigned substitute teacher.");
//     } catch (error) {
//       console.error("Error assigning substitute teacher:", error);
//       alert("Error assigning substitute teacher. Please try again.");
//     }

//     substituteReportDiv.style.display = "block";
//     substituteForm2.style.display = "none";
//   });

//   substituteHomeButton.addEventListener("click", () => {
//     location.reload();
//   });

//   const substituteCancelButton = document.querySelector(
//     '#substituteForm2 button[type="reset"]'
//   );
//   substituteCancelButton.addEventListener("click", (event) => {
//     event.preventDefault();
//     substituteForm1.style.display = "inherit";
//     substituteForm2.style.display = "none";
//     substituteForm1.reset();
//     substituteForm2.reset();

//     substituteReportDiv.style.display = "none";
//   });
// });

// Get the forms and the content div

document.addEventListener("DOMContentLoaded", function() {
  var form1 = document.getElementById('medicalAttendenceForm1');
  var form2 = document.getElementById('medicalAttendenceForm2');
  var contentDiv = document.getElementById('medical-attendence-content');
  var reportDiv = contentDiv.querySelector('.medical-attendence-report');
  var tableBody = document.getElementById('medical-attendance-tableBody');

  // Function to redirect to form2 and hide form1
  function redirectToForm2() {
      form1.style.display = 'none';
      form2.style.display = 'block';
  }

  // Function to fetch subjects from JSON file based on the collegeId
  function fetchSubjects() {
      var collegeId = document.getElementById('medical-attendance').value;
      // Assuming the JSON file is named 'medicalAttendenceSubjects.json' and is in the same directory
      fetch('../json/medicalAttendenceSubjects.json')
          .then(response => response.json())
          .then(data => {
              var subjectOptions = '<option value="">Search</option>';
              if (data[collegeId] && data[collegeId].subjects) {
                  data[collegeId].subjects.forEach(subject => {
                      subjectOptions += '<option value="' + subject + '">' + subject + '</option>';
                  });
                  document.getElementById('medical-attendence-subject').innerHTML = subjectOptions;
                  redirectToForm2();
              } else {
                  Toastify({
                      text: "Subjects not found for the given College ID",
                      duration: 3000,
                      close: true,
                      gravity: "top",
                      position: "center",
                      backgroundColor: "#f44336",
                      stopOnFocus: true
                  }).showToast();
              }
          })
          .catch(error => {
              console.error('Error fetching the subjects:', error);
              Toastify({
                  text: "Error fetching the subjects",
                  duration: 3000,
                  close: true,
                  gravity: "top",
                  position: "center",
                  backgroundColor: "#f44336",
                  stopOnFocus: true
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
              { date: '2024-01-01', status: 'Present', classType: 'Lecture' },
              { date: '2024-01-02', status: 'Absent', classType: 'Lab' },
              { date: '2024-01-03', status: 'Present', classType: 'Lecture' },
              { date: '2024-01-04', status: 'Present', classType: 'Lecture' },
              { date: '2024-01-05', status: 'Absent', classType: 'Lab' },
              { date: '2024-01-06', status: 'Present', classType: 'Lecture' },
              { date: '2024-01-07', status: 'Present', classType: 'Lecture' },
              { date: '2024-01-08', status: 'Absent', classType: 'Lab' },
              { date: '2024-01-09', status: 'Present', classType: 'Lecture' },
              { date: '2024-01-10', status: 'Present', classType: 'Lecture' }
          ];
          resolve(attendanceData);
      });
  }

  // Function to generate the report
  function generateReport() {
      var subjectId = document.getElementById('medical-attendence-subject').value;
      if (!subjectId) {
          Toastify({
              text: "Please select a subject",
              duration: 3000,
              close: true,
              gravity: "top",
              position: "center",
              backgroundColor: "#f44336",
              stopOnFocus: true
          }).showToast();
          return;
      }

      // Assuming the report details are fetched from a server-side API or database
      // For simplicity, let's just simulate the report data
      var reportData = {
          batch: 'Batch 1',
          semester: 'Semester 1',
          section: 'Section A',
          subject: subjectId,  // use the selected subject
          teacher: 'Mr. Smith'
      };

      // Update the report details in the content div
      document.getElementById('medical-attendence-reportBatch').innerHTML = reportData.batch;
      document.getElementById('medical-attendence-reportSemester').innerHTML = reportData.semester;
      document.getElementById('medical-attendence-reportSection').innerHTML = reportData.section;
      document.getElementById('medical-attendence-reportSubject').innerHTML = reportData.subject;
      document.getElementById('medical-attendence-reportTeacher').innerHTML = reportData.teacher;

      // Fetch and populate the table with dynamic data
      fetchAttendanceData(subjectId).then(populateTable);

      // Show the report div
      reportDiv.style.display = 'block';
      // Hide form2
      form2.style.display = 'none';
  }

  // Function to populate the table with dynamic data
  function populateTable(attendanceData) {
      // Clear existing table data
      tableBody.innerHTML = '';

      // Populate table with dynamic data
      attendanceData.forEach(function(rowData) {
          var row = document.createElement('tr');
          var dateCell = document.createElement('td');
          var statusCell = document.createElement('td');
          var classTypeCell = document.createElement('td');

          dateCell.textContent = rowData.date;
          statusCell.innerHTML = '<input type="checkbox" ' + (rowData.status === 'Present' ? 'checked' : '') + '>';
          classTypeCell.textContent = rowData.classType;

          row.appendChild(dateCell);
          row.appendChild(statusCell);
          row.appendChild(classTypeCell);
          tableBody.appendChild(row);
      });
  }

  // Function to redirect back to form1 when cancel button is clicked
  function cancelForm2() {
      form2.style.display = 'none';
      form1.style.display = 'block';
  }

  // Function to redirect back to form1 when home button is clicked
  function redirectToForm1() {
      reportDiv.style.display = 'none';
      form1.style.display = 'block';
  }

  // Function to check if form details are filled before submitting
  function validateForm1() {
      var collegeId = document.getElementById('medical-attendance').value;
      if (collegeId === '') {
          Toastify({
              text: "Please enter the college Id",
              duration: 3000,
              close: true,
              gravity: "top",
              position: "center",
              backgroundColor: "#f44336",
              stopOnFocus: true
          }).showToast();
          return false;
      }
      return true;
  }

  // Function to check if subject is selected before submitting
  function validateForm2() {
      var subject = document.getElementById('medical-attendence-subject').value;
      if (subject === '') {
          Toastify({
              text: "Please select a subject",
              duration: 3000,
              close: true,
              gravity: "top",
              position: "center",
              backgroundColor: "#f44336",
              stopOnFocus: true
          }).showToast();
          return false;
      }
      return true;
  }

  // Add event listeners to the forms
  form1.addEventListener('submit', function(event) {
      event.preventDefault();
      if (validateForm1()) {
          fetchSubjects();
      }
  });

  form2.addEventListener('submit', function(event) {
      event.preventDefault();
      if (validateForm2()) {
          generateReport();
      }
  });

  form2.querySelector('.medicalAttendenceBtn[type="reset"]').addEventListener('click', cancelForm2);

  // Add event listener to the home button in the report div
  reportDiv.querySelector('.medicalAttendenceBtn[type="button"]').addEventListener('click', redirectToForm1);
});


// Function to set the maximum date for the date input field based on the current IST date and time
function setMaxDate() {
  var now = new Date(); // Current UTC date and time
  var istOffset = 330; // IST offset in minutes (+5:30)
  now.setMinutes(now.getMinutes() + istOffset); // Convert UTC to IST

  var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  var tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1); // Increment the day by 1

  document.getElementById("date").max = tomorrow.toISOString().split("T")[0];
}

// Set max date on page load and adjust as necessary
document.addEventListener("DOMContentLoaded", setMaxDate);

// Attach the transferData() function to the form's submit event
document.getElementById("submit").addEventListener("click", function (event) {
  transferData(event);
});
