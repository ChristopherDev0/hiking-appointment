//field inputs
const firtsNameInput = document.querySelector('#firts-name');
const lastNameInput = document.querySelector('#last-name');
const numberPhoneInput = document.querySelector('#phone');
const scheduledDateInput = document.querySelector('#date');
const scheduledTimeInput = document.querySelector('#time');
const dataExtraInput = document.querySelector('#extra-data');

//variables user interface
const formData = document.querySelector('#form');
const appointmentMade = document.querySelector('#ul-schedule');
let editingFields;

//classes
class Appointments {
    constructor() {
        this.appointments = [];
    }

    addAppoinment(appointment) {
        this.appointments = [...this.appointments, appointment];
    }

    deleteAppoinment(id) {
        this.appointments = this.appointments.filter(cita => cita.id != id);
    }

    editAppointment(updateAppointment) {
        this.appointments = this.appointments.map(citale => citale.id === updateAppointment.id ? updateAppointment : citale);
    }
}

/* let arrayStoraged = new Appointments();
//local Storage
loadStorage();
function loadStorage() {
   document.addEventListener('DOMContentLoaded', () => {
        let arrayStorage = JSON.parse(localStorage.getItem('appointment')) || [];
        let copiaArray = arrayStorage.appointments;
        if(arrayStorage.length === ''){
            return;
        }else{
            copiaArray.forEach(hola => {
                loadEdition(hola);
                const {firtsName, lastName, numberPhone, scheduledDate, scheduledTime, dataExtra, id} = hola;
                appointmentObject.firtsName = firtsName;
                appointmentObject.lastName = lastName;
                appointmentObject.numberPhone = numberPhone;
                appointmentObject.scheduledDate = scheduledDate;
                appointmentObject.scheduledTime = scheduledTime;
                appointmentObject.dataExtra = dataExtra;
                appointmentObject.id = id;
            })
            arrayStoraged.addAppoinment()
            ui.showAppointment(arrayStorage);
        }
   })
}
 */
class UI {
    showAlert(message, messageType){
        const divMessage = document.createElement('div');
        divMessage.classList.add('alert');

        if(messageType === 'error'){
            divMessage.classList.add('alert-danger');
        }else{
            divMessage.classList.add('alert-seccess');
        }

        divMessage.textContent = message;
        document.querySelector('.alert-field').insertBefore(divMessage, document.querySelector('butoon-form'));
        
        setTimeout(() => {
            divMessage.remove();
        }, 5000)
    }

    alertAppointment(message){
        const divMessage = document.createElement('div');
        divMessage.classList.add('alert-appointment');
        divMessage.textContent = message;
        document.querySelector('.appointment-alert').insertBefore(divMessage, document.querySelector('list-schedule'));
        
        setTimeout(() => {
            divMessage.remove();
        }, 5000)
    }

    showAppointment({appointments}) {
        this.cleanHTML();
        /* const logitud = appointments.length;
        appointments.splice(0, logitud -1);
        console.log(appointments); */
       appointments.forEach( dataAppo => {
            const {firtsName, lastName, numberPhone, scheduledDate, scheduledTime, dataExtra, id} = dataAppo;
            const divAppointment = document.createElement('div');
            divAppointment.classList.add('appointment');
            divAppointment.dataset.id = id;

            //scripting
            const firtsNameText = document.createElement('h3');
            firtsNameText.classList.add('firtsName');
            firtsNameText.innerHTML = `the appointment for: <span class="font-color">${firtsName}</span>`;

            const textName = document.createElement('p');
            textName.innerHTML = `<span class="font-bold">Client: </span> ${firtsName} ${lastName}`;

            const textPhone = document.createElement('p');
            textPhone.innerHTML = `<span class="font-bold">Phone: </span> ${numberPhone}`;

            const textDate = document.createElement('p');
            textDate.innerHTML = `<span class="font-bold">Date: </span> ${scheduledDate}`;

            const textTime = document.createElement('p');
            textTime.innerHTML = `<span class="font-bold">Time: </span> ${scheduledTime}`;

            const textExtra = document.createElement('p');
            textExtra.innerHTML = `<span class="font-bold">Data: </span> ${dataExtra}`;

            //btn delete 
            const btnDelete = document.createElement('button');
            btnDelete.classList.add('btn-appointment', 'btn-delete');
            btnDelete.innerHTML = `Delete <ion-icon name="close"></ion-icon>`;
            btnDelete.onclick = () => deleteAppoinment(id);

            //btn edit
            const btnEdit = document.createElement('button');
            btnEdit.classList.add('btn-appointment', 'btn-edit');
            btnEdit.innerHTML = `Edit data <ion-icon name="pencil"></ion-icon>`;
            btnEdit.onclick = () => loadEdition(dataAppo);


            //adding appointment
            divAppointment.appendChild(firtsNameText);
            divAppointment.appendChild(textName);
            divAppointment.appendChild(textPhone);
            divAppointment.appendChild(textDate);
            divAppointment.appendChild(textTime);
            divAppointment.appendChild(textExtra);
            divAppointment.appendChild(btnDelete);
            divAppointment.appendChild(btnEdit);

            //adding HTML
            appointmentMade.appendChild(divAppointment);

       })
    }

    cleanHTML() {
        while(appointmentMade.firstChild){
            appointmentMade.removeChild(appointmentMade.firstChild);
        }
        
    }
}

//global instances
const ui = new UI();
const manageAppointments = new Appointments();

//events 
eventListeners();
function eventListeners() {
    firtsNameInput.addEventListener('input', dataAppointment);
    lastNameInput.addEventListener('input', dataAppointment);
    numberPhoneInput.addEventListener('input', dataAppointment);
    scheduledDateInput.addEventListener('input', dataAppointment);
    scheduledTimeInput.addEventListener('input', dataAppointment);
    dataExtraInput.addEventListener('input', dataAppointment);

    formData.addEventListener('submit', newAppointment);
}

//object to values
const appointmentObject = {
    firtsName: '',
    lastName: '',
    numberPhone: '',
    scheduledDate: '',
    scheduledTime: '',
    dataExtra: ''
}

//functions
function dataAppointment(e) {
    appointmentObject[e.target.name] = e.target.value;
}

function newAppointment(e){
    e.preventDefault();
    const {firtsName, lastName, numberPhone, scheduledDate, scheduledTime, dataExtra} = appointmentObject;

    if(firtsName === '' || lastName === '' || numberPhone === '' || scheduledDate === '' || scheduledTime === '' || dataExtra === ''){
        ui.showAlert('All fields are required','error');
        return;
    }

    if(editingFields){
        ui.alertAppointment('Edit success');
        manageAppointments.editAppointment({...appointmentObject});
        formData.querySelector('button[type="submit"]').textContent = 'schedule now';
        editingFields = false;
    }else{
        console.log('cita');

        appointmentObject.id = Date.now(); //add id
        manageAppointments.addAppoinment({...appointmentObject});
        ui.showAlert('successfully sent');
        console.log(manageAppointments);
        //locaStorage
        syncStorage(manageAppointments);    
    }
    
    //reset form and ui
    restartingObject();
    formData.reset();
    ui.showAppointment(manageAppointments);
}

function restartingObject(){
    appointmentObject.dataExtra = '';
    appointmentObject.firtsName = '';
    appointmentObject.lastName = '';
    appointmentObject.numberPhone = '';
    appointmentObject.scheduledDate = '';
    appointmentObject.scheduledTime = '';
}

function deleteAppoinment(id) {
    const option = window.confirm('Are you sure of delete?');
    if(!option){
        return;
    }
    //delete
    manageAppointments.deleteAppoinment(id);
    //alert
    ui.alertAppointment('Appoinment delete with success');
    //show html
    ui.showAppointment(manageAppointments);

}

function loadEdition(appointment) {
    const {firtsName, lastName, numberPhone, scheduledDate, scheduledTime, dataExtra, id} = appointment;

    //fill inputs
    firtsNameInput.value = firtsName;
    lastNameInput.value = lastName;
    numberPhoneInput.value = numberPhone;
    scheduledDateInput.value = scheduledDate;
    scheduledTimeInput.value = scheduledTime;
    dataExtraInput.value = dataExtra;

    //fill object
    console.log(appointmentObject)
    appointmentObject.firtsName = firtsName;
    appointmentObject.lastName = lastName;
    appointmentObject.numberPhone = numberPhone;
    appointmentObject.scheduledDate = scheduledDate;
    appointmentObject.scheduledTime = scheduledTime;
    appointmentObject.dataExtra = dataExtra;
    appointmentObject.id = id;
    console.log(appointmentObject)

    //change botton form
    formData.querySelector('button[type="submit"]').textContent = 'Save Changes';
    editingFields = true;
}

function syncStorage(appointmentLocal) {
    localStorage.setItem('appointment', JSON.stringify(appointmentLocal));
}