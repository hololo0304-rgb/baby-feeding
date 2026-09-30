console.log("Baby Feed App Start");

let currentTime = new Date();

document.addEventListener("DOMContentLoaded", () => {

    initTypeButtons();
    initMilkButtons();
    initTime();

    document
        .getElementById("add5Btn")
        .addEventListener("click", add5Minutes);

    document
        .getElementById("saveBtn")
        .addEventListener("click", saveRecord);

    loadRecords();

});

function initTime(){

    currentTime = new Date();

    updateDisplayTime();

}

function updateDisplayTime(){

    document
        .getElementById("feedTime")
        .value =
        currentTime.toISOString();

    document
        .getElementById("displayTime")
        .innerText =
        currentTime.toLocaleString(
            "zh-TW",
            {
                timeZone:"Asia/Taipei"
            }
        );

}

function add5Minutes(){

    currentTime.setMinutes(
        currentTime.getMinutes()+5
    );

    updateDisplayTime();

}

function initTypeButtons(){

    document
        .querySelectorAll(".type-btn")
        .forEach(btn=>{

            btn.addEventListener("click",()=>{

                document
                    .querySelectorAll(".type-btn")
                    .forEach(x=>
                        x.classList.remove("active")
                    );

                btn.classList.add("active");

                document
                    .getElementById("feedType")
                    .value =
                    btn.dataset.type;
            });

        });

}

function initMilkButtons(){

    document
        .querySelectorAll(".milk-btn")
        .forEach(btn=>{

            btn.addEventListener("click",()=>{

                document
                    .querySelectorAll(".milk-btn")
                    .forEach(x=>
                        x.classList.remove("active")
                    );

                btn.classList.add("active");

                document
                    .getElementById("preparedAmount")
                    .value =
                    btn.dataset.ml;
            });

        });

}

async function saveRecord(){

    try{

        const payload = {

            feedTime:
                document.getElementById(
                    "feedTime"
                ).value,

            feedType:
                document.getElementById(
                    "feedType"
                ).value,

            preparedAmount:
                Number(
                    document.getElementById(
                        "preparedAmount"
                    ).value
                ),

            remainingAmount:0

        };

        console.log(payload);

        await fetch(
            window.CONFIG.GAS_URL,
            {
                method:"POST",

                headers:{
                    "Content-Type":"text/plain"
                },

                body:
                JSON.stringify(payload)
            }
        );

        alert("✅ 已記錄");

        await loadRecords();

    }
    catch(error){

        console.error(error);

        alert("寫入失敗");

    }
}

async function loadRecords(){

    try{

        const response =
        await fetch(
            window.CONFIG.GAS_URL
        );

        const records =
        await response.json();

        renderRecords(records);

        if(records.length){

            updateSummary(records[0]);
        }

    }
    catch(error){

        console.error(error);
    }

}

function updateSummary(lastRecord){

    const feedTime =
    new Date(lastRecord.feedTime);

    const diff =
    Date.now() - feedTime.getTime();

    const h =
    Math.floor(diff/1000/60/60);

    const m =
    Math.floor(
        (diff/1000/60)%60
    );

    document
        .getElementById(
            "lastInterval"
        )
        .innerText =
        `${h}h ${m}m`;

    const drinkAmount =
        (Number(lastRecord.preparedAmount)||0)
        -
        (Number(lastRecord.remainingAmount)||0);

    document
        .getElementById(
            "lastDrinkAmount"
        )
        .innerText =
        `${drinkAmount}ml`;

}

function renderRecords(records){

    const container =
    document.getElementById(
        "recordsContainer"
    );

    if(!records.length){

        container.innerHTML =
        "尚無資料";

        return;
    }

    container.innerHTML =
    records
    .slice(0,10)
    .map(r=>{

        const drink =
        (Number(r.preparedAmount)||0)
        -
        (Number(r.remainingAmount)||0);

        return `

        <div class="record">

            <strong>
            ${new Date(r.feedTime)
            .toLocaleString("zh-TW")}
            </strong>

            <br>

            ${r.feedType}

            |

            ${drink} ml

        </div>

        `;

    })
    .join("");

}
