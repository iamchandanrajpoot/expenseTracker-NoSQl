const premiumDiv = document.getElementById("premium-div");
document.addEventListener("DOMContentLoaded", async function displayUserUi() {
  try {
    const response = await fetch("http://localhost:4000/user", {
      method: "GET",
      headers: { Authorization: localStorage.getItem("authToken") },
    });
    const user = await response.json();
    console.log(user);

    if (user.isPremiumUser) {
      premiumDiv.innerHTML = `Your premium user now <br /> <br />
        <button id='leader-board-btn'>Leader Board </button> <br /><br />
        <button id="downloadexpense">Download File</button>
        `;

      const leaderBoardBtn = document.getElementById("leader-board-btn");
      leaderBoardBtn.addEventListener("click", displayLeaderBoadrd);

      const downloadBtn = document.getElementById("downloadexpense");
      downloadBtn.addEventListener("click", async function download() {
        try {
          const response = await fetch("http://localhost:4000/user/download", {
            method: "GET",
            headers: { Authorization: localStorage.getItem("authToken") },
          });

          if (response.status === 201) {
            const data = await response.json();
            var a = document.createElement("a");
            console.log(data.fileUrl);
            a.href = data.fileUrl;
            a.download = "myexpense.csv";
            a.click();
          }
        } catch (error) {
          console.log(error);
        }
      });
    } else {
      premiumDiv.innerHTML =
        '<button id="rozorpay-btn">Purchase Premium</button>';
      const rozorpayBtn = document.getElementById("rozorpay-btn");
      rozorpayBtn.addEventListener("click", async (e) => {
        try {
          const response = await fetch(
            "http://localhost:4000/purchase/premium-membership",
            {
              method: "GET",
              headers: { Authorization: localStorage.getItem("authToken") },
            }
          );
          console.log(response);
          const result = await response.json();
          console.log(result);

          const options = {
            key: result.key_id,
            currency: "INR",
            order_id: result.order.id,
            handler: async function (response) {
              try {
                console.log(response);
                // Handle successful payment response
                const updateTransactionResponse = await fetch(
                  "http://localhost:4000/purchase/update-transaction-status",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: localStorage.getItem("authToken"),
                    },
                    body: JSON.stringify({
                      order_id: result.order.id,
                      payment_id: response.razorpay_payment_id,
                      status: "SUCCESSFULL",
                    }),
                  }
                );
                const responseData = await updateTransactionResponse.json();
                console.log(responseData);
                premiumDiv.innerHTML = `Your premium user now <br /> <br />
                <button id='leader-board-btn'>Leader Board </button> <br /><br />
                <button id="downloadexpense">Download File</button>
                `;

                const leaderBoardBtn =
                  document.getElementById("leader-board-btn");
                leaderBoardBtn.addEventListener("click", displayLeaderBoadrd);

                const downloadBtn = document.getElementById("downloadexpense");
                downloadBtn.addEventListener(
                  "click",
                  async function download() {
                    try {
                      const response = await fetch(
                        "http://localhost:4000/user/download",
                        {
                          method: "GET",
                          headers: {
                            Authorization: localStorage.getItem("authToken"),
                          },
                        }
                      );

                      if (response.status === 201) {s
                        const data = await response.json();
                        var a = document.createElement("a");
                        console.log(data.fileUrl);
                        a.href = data.fileUrl;
                        a.download = "myexpense.csv";
                        a.click();
                      }
                    } catch (error) {
                      console.log(error);
                    }
                  }
                );
                alert("You are now a premium user");
              } catch (error) {
                console.error("Error updating transaction status:", error);
                alert("Error updating transaction status");
              }
            },
          };

          const rzp1 = new Razorpay(options);
          rzp1.open();
          e.preventDefault();
          // Handle FAILED payment response
          rzp1.on("payment.failed", async function (response) {
            alert(response.error.code);
            const updateTransactionResponse = await fetch(
              "http://localhost:4000/purchase/update-transaction-status",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: localStorage.getItem("authToken"),
                },
                body: JSON.stringify({
                  order_id: result.order.id,
                  payment_id: response.razorpay_payment_id,
                  status: "FAILED",
                }),
              }
            );

            const responseData = await updateTransactionResponse.json();
            console.log(responseData);
            alert("payment failed");
          });
        } catch (error) {
          console.log(error);
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
});
// -----------------------------------------------
document.getElementById("perpage").value =
  localStorage.getItem("perpage") || document.getElementById("perpage").value ;

const perpageElement = document.getElementById("perpage");
perpageElement.addEventListener("change", function handlePerpageChange(e) {
  const perpageValue = e.target.value;
  localStorage.setItem("perpage", perpageValue);
});

const expenseList = document.getElementById("expense-list");

// -----------working----------------------
async function getExpenses(page) {
  let currentPage = page;
  console.log("currentpage:", page);
  try {
    const response = await fetch(
      `http://localhost:4000/api/expenses?page=${page}&perpage=${localStorage.getItem(
        "perpage"
      )}`,
      {
        method: "GET",
        headers: { Authorization: localStorage.getItem("authToken") },
      }
    );
    const data = await response.json();
    console.log(data);
    const { expenses, totalPages } = data;
    expenseList.innerHTML = ""; // Clear previous content

    expenses.forEach((expense) => {
      const li = document.createElement("li");
      li.setAttribute("key", expense.id);
      li.innerHTML = `${expense.expendicture} - ${expense.description} - ${expense.category} <button class="delete">Delete Expense</button>`;
      expenseList.appendChild(li);
    });

    const pagination = document.getElementById("pagination");
    pagination.innerHTML = ""; // Clear previous pagination links

    pagination.innerHTML += ` 1-${localStorage.getItem(
      "perpage"
    )} of ${totalPages} `;

    const prevButton = document.createElement("button");
    prevButton.textContent = "<";
    prevButton.addEventListener("click", () => {
      if (currentPage > 1) {
        getExpenses(currentPage - 1);
      }
    });
    if (currentPage > 1) {
      pagination.appendChild(prevButton);
    } else {
      prevButton.disabled = true;
      pagination.appendChild(prevButton);
    }

    const nextButton = document.createElement("button");
    nextButton.textContent = ">";
    nextButton.addEventListener("click", () => {
      if (currentPage < totalPages) {
        getExpenses(currentPage + 1);
      }
    });
    if (currentPage < totalPages) {
      pagination.appendChild(nextButton);
    } else {
      nextButton.disabled = true;
      pagination.appendChild(nextButton);
    }
  } catch (error) {
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  getExpenses(1); // Fetch users for the initial page
});

// -----------working-----------------------
function displayExpense(expense) {
  const li = document.createElement("li");
  li.setAttribute("key", expense.id);
  li.innerHTML = `${expense.expendicture} - ${expense.description} - ${expense.category} <button class = "delete">Delete Expense</ button>`;
  expenseList.appendChild(li);
}

//-------------working---------------------------
const expenseForm = document.getElementById("expense-form");
expenseForm.addEventListener("submit", function handlePostExpense(e) {
  e.preventDefault();
  const expenseData = {
    expendicture: e.target.expendicture.value,
    description: e.target.description.value,
    category: e.target.category.value,
  };
  fetch("http://localhost:4000/api/add-expense", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("authToken"),
    },
    body: JSON.stringify(expenseData),
  })
    .then((response) => {
      console.log(response);
      return response.json();
    })
    .then((result) => {
      console.log(result);
      if (result.successful) {
        displayExpense(result.expense);
        //   document.getElementById("message").innerHTML = data.message;
      }
    })
    .catch((err) => console.log(err));
});

// -------------working------------------------------
expenseList.addEventListener("click", async (e) => {
  try {
    if ((e.target.className = "delete")) {
      // console.log("button is clicked");
      const response = await fetch(
        `http://localhost:4000/api/expenses/${e.target.parentElement.getAttribute(
          "key"
        )}`,
        {
          method: "DELETE",
          headers: {
            Authorization: localStorage.getItem("authToken"),
          },
        }
      );
      if (response.status === 200) {
        e.target.parentElement.remove();
      }
    }
  } catch (error) {
    console.log(error);
  }
});

// -------------working--------------------------------

async function displayLeaderBoadrd() {
  try {
    const response = await fetch(
      "http://localhost:4000/purchase/leader-board",
      {
        method: "GET",
        headers: { Authorization: localStorage.getItem("authToken") },
      }
    );
    const premiumUsers = await response.json();

    const leaderboard = document.getElementById("leader-board");
    leaderboard.style.display = "block";
    leaderboard.innerHTML = "";
    const h1 = document.createElement("h1");
    h1.innerHTML = "Leader Board";
    leaderboard.appendChild(h1);
    const ul = document.createElement("ul");
    premiumUsers.forEach((premiumUser) => {
      const li = document.createElement("li");
      li.innerHTML = `Name: ${premiumUser.name}, Total Expense : ${premiumUser.totalExpense}`;
      ul.appendChild(li);

      const downloadexpensebtn = document.getElementById("downloadexpense");
      downloadexpensebtn.style.display = "block";
    });
    leaderboard.appendChild(ul);
  } catch (error) {
    console.log(error);
  }
}

// document.addEventListener("DOMContentLoaded", () => {

// });

const downloadedFilesDiv = document.getElementById("downloaded-files");
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch(
      "http://localhost:4000/user/downloaded-files",
      {
        method: "GET",
        headers: { Authorization: localStorage.getItem("authToken") },
      }
    );

    if (response.status == 200) {
      const h1 = document.createElement("h1");
      h1.innerHTML = "Downloaded Files";
      downloadedFilesDiv.appendChild(h1);

      const ul = document.createElement("ul");
      downloadedFilesDiv.appendChild(ul);
      const result = await response.json();
      result.downloadFiles.forEach((downloadedFile) => {
        // console.log(downloadedFile)
        const li = document.createElement("li");
        li.innerHTML = `${downloadedFile.fileUrl}`;
        ul.appendChild(li);
      });
    } else {
      throw error("something went worong");
    }
  } catch (error) {
    console.log(error);
  }
});
