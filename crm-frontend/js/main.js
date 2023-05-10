(() => {
    document.addEventListener('DOMContentLoaded', () => {

        let countNumber = null;
        let client = {};
        let contact = [];
        let clientList = null;
        let getClientID = null;
        let clientInputSearch = null;
        let searchClient = {};
        let state = false;

        function createPage() {
            const container = document.createElement('div');
            const headerSite = document.createElement('header');
            const logoSite = document.createElement('img');
            const headerInputSearch = document.createElement('input');

            const main = document.createElement('main');
            const textHead = document.createElement('h1');
            const tableHead = document.createElement('div');
            const tableBody = document.createElement('div');
            const tableContainer = document.createElement('section');
            const addClient = document.createElement('button');

            const tableID = document.createElement('div');
            const tableAbbrName = document.createElement('div');
            const tableDateCreate = document.createElement('div');
            const tableDateChanges = document.createElement('div');
            const tableContact = document.createElement('div');
            const tableActions = document.createElement('div');


            document.body.append(container);
            container.append(headerSite);
            container.append(main);


            headerSite.append(logoSite);
            headerSite.append(headerInputSearch);

            main.append(textHead);
            main.append(tableContainer);
            tableContainer.append(tableHead)
            tableContainer.append(tableBody)
            main.append(addClient);

            tableHead.append(tableID);
            tableHead.append(tableAbbrName);
            tableHead.append(tableDateCreate);
            tableHead.append(tableDateChanges);
            tableHead.append(tableContact);
            tableHead.append(tableActions);


            container.classList.add('container');
            headerSite.classList.add('header-site');
            logoSite.classList.add('header-site__logo');
            headerInputSearch.classList.add('header-site__search');
            tableContainer.classList.add('table-container');

            tableHead.classList.add('table-head');
            tableBody.classList.add('table-body');
            tableID.classList.add('table-head__ID');
            tableAbbrName.classList.add('table-head__abbr-name');
            tableDateCreate.classList.add('table-head__date-create');
            tableDateChanges.classList.add('table-head__date-changes');
            tableContact.classList.add('table-head__contact');
            tableActions.classList.add('table-head__actions');
            addClient.classList.add('btn-add');

            logoSite.src = "./img/logo.png";
            headerInputSearch.placeholder = 'Введите запрос';

            textHead.textContent = 'Клиенты';

            tableID.textContent = 'ID';
            tableAbbrName.textContent = 'Фамилия Имя Отчество';
            tableDateCreate.textContent = 'Дата и время создания';
            tableDateChanges.textContent = 'Последние изменения';
            tableContact.textContent = 'Контакты';
            tableActions.textContent = 'Действия';
            addClient.textContent = 'Добавить клиента';

            addClient.addEventListener('click', () => {
                clientModalAdd();
                customPlaceholder('input-surname', 'placeholder-surname');
                customPlaceholder('input-name', 'placeholder-name');
                customPlaceholder('input-lastname', 'placeholder-lastname');
            });

            getData();

            return {
                container,
                headerSite,
                logoSite,
                headerInputSearch,
                main,
                textHead,
                tableHead,
                tableBody,
                addClient,
                tableID,
                tableAbbrName,
                tableActions,
                tableDateChanges,
                tableDateCreate,
                tableContact,
            };

        };

        let createApp = createPage();


        function displayDate(string) {
            string.replaceAll("T", " ").slice(0, -14);
            return string[8] + string[9] + '.' + string[5] + string[6] + '.' + string[0] + string[1] + string[2] + string[3];
        }

        function displayTime(string) {
            return string.substr(11, 5);
        }

        function validate(inputName, inputSurname, searchForm, searchBtnSave, func) {
            const errorBorder = document.querySelector('.error-border');
            const errorInput = document.querySelector('.error-input');
            const searchInputContact = document.querySelectorAll('.input-contact');
            let inputContactValue = null;
            for (const value of searchInputContact.values()) {
                inputContactValue = value;
            }
            if (errorBorder) errorBorder.classList.remove('error-border');
            if (errorInput) errorInput.classList.remove('error-input');

            if (inputSurname.value == '') {
                textValidate('Укажите фамилию!', searchForm, searchBtnSave);
                inputSurname.classList.add('error-border');
            }
            else if (inputName.value == '') {
                textValidate('Укажите имя!', searchForm, searchBtnSave);
                inputName.classList.add('error-border');
            }
            else if (inputContactValue !== null) {
                if (inputContactValue.value == '') {
                    textValidate('Заполните все контакты!', searchForm, searchBtnSave);
                    inputContactValue.classList.add('error-input');
                }
                else {
                    addClient();
                    func();
                }
            }
            else if (inputName !== '' && inputSurname !== '') {
                addClient();
                func();
            }
        }

        function validTextInput(input) {
            input.addEventListener('input', () => {
                input.value = input.value.replace(/[^А-Яа-яЁё -]/g, '');
            });

            input.addEventListener('blur', () => {
                let validate = input.value.trim().replace(/\-{2,}/g, '-').replace(/^-+|-$/g, '');
                if (input.value !== '') {
                    input.value = validate[0].toUpperCase() + validate.slice(1).replace(/\s{2,}/g, ' ');
                }
            });
        }

        function textValidate(text, form, button) {
            const searchText = document.querySelector('.error-text');
            if (searchText) {
                searchText.remove();
            }
            const errorText = document.createElement('p');

            form.insertBefore(errorText, button);

            errorText.classList.add('error-text');
            errorText.textContent = `${text}`;
        }

        function renderingTable(array) {
            createApp.tableBody.replaceChildren();
            for (const i of array) {
                const itemClient = document.createElement('div');
                const clientID = document.createElement('div');
                const clientName = document.createElement('div');
                const createdClientAt = document.createElement('div');
                const updatedClientAt = document.createElement('div');
                const clientContactList = document.createElement('div');
                const btnContainer = document.createElement('div');
                const changeClient = document.createElement('button');
                const deleteClient = document.createElement('button');

                const spanColorOne = document.createElement('span');
                const spanColorTwo = document.createElement('span');
                const deleteHideContact = document.createElement('div');

                let countContactNumber = 0;


                createApp.tableBody.append(itemClient);
                itemClient.append(clientID);
                itemClient.append(clientName);
                itemClient.append(createdClientAt);
                itemClient.append(updatedClientAt);
                itemClient.append(clientContactList);
                itemClient.append(btnContainer);
                btnContainer.append(changeClient);
                btnContainer.append(deleteClient);

                itemClient.classList.add('item-client');
                clientID.classList.add('client-id');
                clientName.classList.add('client-name');
                createdClientAt.classList.add('created-date');
                updatedClientAt.classList.add('update-date');
                clientContactList.classList.add('contact-list');
                btnContainer.classList.add('btn-change-container');
                changeClient.classList.add('change-client-btn');
                deleteClient.classList.add('delete-client-btn');
                spanColorOne.classList.add('span-color');
                spanColorTwo.classList.add('span-color');
                deleteHideContact.classList.add('delete-hide-contact');

                clientID.textContent = i.id;
                clientName.textContent = i.surname + ' ' + i.name + ' ' + i.lastName;
                createdClientAt.textContent = displayDate(i.createdAt) + " ";
                spanColorOne.textContent = displayTime(i.createdAt);
                updatedClientAt.textContent = displayDate(i.updatedAt) + " ";
                spanColorTwo.textContent = displayTime(i.updatedAt);
                changeClient.dataset.id = i.id;
                deleteClient.dataset.id = i.id;
                for (const contact of i.contacts) {

                    countContactNumber++;
                    let iconContact = document.createElement('img');
                    iconContact.classList.add('icon-contact');
                    clientContactList.append(iconContact);
                    iconContact.dataset.contactNumber = countContactNumber;

                    if (contact.type == 'Телефон') {
                        tippy(iconContact, {
                            content: 'Телефон:' + ' ' + `<b style="color: #B89EFF">${contact.value}</b>`,
                            duration: 500,
                            theme: 'tooltip-style',
                            allowHTML: true,
                        });
                        iconContact.src = "./img/phone.svg";
                    }
                    else if (contact.type == 'E-Mail') {
                        tippy(iconContact, {
                            content: 'E-Mail:' + ' ' + `<b style="color: #B89EFF">${contact.value}</b>`,
                            duration: 500,
                            theme: 'tooltip-style',
                            allowHTML: true,
                        });
                        iconContact.src = './img/mail.svg';
                    }
                    else if (contact.type == 'Facebook') {
                        tippy(iconContact, {
                            content: 'Facebook:' + ' ' + `<b style="color: #B89EFF">${contact.value}</b>`,
                            duration: 500,
                            theme: 'tooltip-style',
                            allowHTML: true,
                        });
                        iconContact.src = './img/fb.svg';
                    }
                    else if (contact.type == 'VK') {
                        tippy(iconContact, {
                            content: 'VK:' + ' ' + `<b style="color: #B89EFF">${contact.value}</b>`,
                            duration: 500,
                            theme: 'tooltip-style',
                            allowHTML: true,
                        });
                        iconContact.src = './img/vk.svg';
                    }
                    else if (contact.type == 'Другое') {
                        tippy(iconContact, {
                            content: 'Другое:' + ' ' + `<b style="color: #B89EFF">${contact.value}</b>`,
                            duration: 500,
                            theme: 'tooltip-style',
                            allowHTML: true,
                        });
                        iconContact.src = './img/other.svg';
                    }
                    hideContact(countContactNumber, iconContact, clientContactList, deleteHideContact);
                }
                changeClient.textContent = 'Изменить';
                deleteClient.textContent = 'Удалить';
                changeClient.addEventListener('click', () => {
                    getClientID = changeClient.getAttribute("data-id");
                    searchData(getClientID);
                });

                deleteClient.addEventListener('click', () => {
                    getClientID = deleteClient.getAttribute("data-id");
                    deleteClientModalWindow();
                });

                createdClientAt.append(spanColorOne);
                updatedClientAt.append(spanColorTwo);
            }
        }

        function hideContact(count, icon, containerContact, hideContactBtn) {
            if (count > 4) {
                icon.classList.add('delete-contact');
                containerContact.append(hideContactBtn);
                const calcHide = count - 4;
                hideContactBtn.textContent = "+" + calcHide;
            }
            hideContactBtn.addEventListener('click', () => {
                icon.classList.remove('delete-contact');
                hideContactBtn.classList.remove('delete-hide-contact');
                hideContactBtn.textContent = "";
            });
        }

        function createFormClient() {
            const placeholderSurname = document.createElement('label');
            const placeholderName = document.createElement('label');
            const placeholderLastName = document.createElement('label');
            const inputSurname = document.createElement('input');
            const inputName = document.createElement('input');
            const inputLastName = document.createElement('input');
            const placeholderSurnameText = document.createElement('div');
            const placeholderNameText = document.createElement('div');
            const placeholderLastNameText = document.createElement('div');
            const addContactContainer = document.createElement('ul');
            const formClient = document.createElement('form');

            const addContact = document.createElement('button');

            placeholderSurname.classList.add('label-surname-add');
            placeholderName.classList.add('label-name-add');
            placeholderLastName.classList.add('label-lastname-add');
            inputSurname.classList.add('input-surname');
            inputName.classList.add('input-name');
            inputLastName.classList.add('input-lastname');
            placeholderSurnameText.classList.add('placeholder-surname');
            placeholderNameText.classList.add('placeholder-name');
            placeholderLastNameText.classList.add('placeholder-lastname');
            addContactContainer.classList.add('add-contact-container');
            addContact.classList.add('btn-add-contact');
            formClient.classList.add('modal-window__add_form');

            placeholderSurnameText.textContent = 'Фамилия';
            placeholderNameText.textContent = 'Имя';
            placeholderLastNameText.textContent = 'Отчество';

            addContact.textContent = 'Добавить контакт';

            formClient.append(placeholderSurname);
            formClient.append(placeholderName);
            formClient.append(placeholderLastName);
            formClient.append(addContactContainer);
            placeholderSurname.append(inputSurname);
            placeholderSurname.append(placeholderSurnameText);
            placeholderName.append(inputName);
            placeholderName.append(placeholderNameText);
            placeholderLastName.append(inputLastName);
            placeholderLastName.append(placeholderLastNameText);
            addContactContainer.append(addContact);

            validTextInput(inputSurname);
            validTextInput(inputName);
            validTextInput(inputLastName);

            addContact.addEventListener('click', (e) => {
                e.preventDefault();
                const addContactModule = addContactList();
                counterNumber(addContact);
                addContactModule.inputContact.dataset.type = "Телефон";
                maskInputInstall("Телефон");
                addContactContainer.classList.add('resize');
            });

            return {
                placeholderSurname,
                placeholderName,
                placeholderLastName,
                inputSurname,
                inputName,
                inputLastName,
                placeholderSurnameText,
                placeholderNameText,
                placeholderLastNameText,
                addContactContainer,
                addContact,
                formClient,
            };
        }

        function counterNumber(btn) {
            const btnDeleteItem = document.querySelectorAll('.delete-item-contact');
            countNumber = 1;
            btnDeleteItem.forEach(items => {
                items.dataset.listNumber = countNumber++;
                if (countNumber == 11) {
                    btn.classList.add('btn-add-disable');
                }
                else if (countNumber <= 10) {
                    btn.classList.remove('btn-add-disable');
                }
            });
        }

        function customPlaceholder(value, prop) {
            const searchInput = document.querySelector(`.${value}`);
            const searchPlaceholder = document.querySelector(`.${prop}`);
            if (searchInput.value !== '') {
                searchPlaceholder.classList.add('input-filled-transition');
            } else {
                searchInput.addEventListener('focusout', () => {
                    if (searchInput.value !== '') {
                        searchPlaceholder.classList.add('input-filled');
                    }
                });
            }
        }

        function clientModalAdd() {
            let createModal = createModalWindow();
            const createFormClients = createFormClient();
            const textFormHead = document.createElement('p');

            const saveClient = document.createElement('button');
            const btnCancel = document.createElement('button');

            textFormHead.classList.add('modal-text');
            saveClient.classList.add('btn-add-save');
            btnCancel.classList.add('btn-cancel');

            createModal.modalWindow.append(textFormHead);
            createModal.modalWindow.append(createFormClients.formClient);
            createFormClients.formClient.append(saveClient);
            createFormClients.formClient.append(btnCancel);
            textFormHead.textContent = 'Новый клиент';
            saveClient.textContent = 'Сохранить';
            btnCancel.textContent = 'Удалить клиента';

            btnCancel.addEventListener('click', () => {
                createFormClients.addContact.setAttribute('disabled', false);
                createFormClients.addContactContainer.classList.remove('resize');
                deleteModalWindow();
            });

            saveClient.addEventListener('click', (e) => {
                e.preventDefault();
                validate(createFormClients.inputName, createFormClients.inputSurname, createFormClients.formClient, saveClient, postData);
            });

        }

        function changeClientModalWindow() {
            const createModal = createModalWindow();
            const createFormClients = createFormClient();
            const headerText = document.createElement('div');
            const headerClientID = document.createElement('span');
            const changeClientSave = document.createElement('button');
            const changeClientDelete = document.createElement('button');
            renderingContact = true;

            const searchContact = searchClient.contacts;

            createModal.modalWindow.append(headerText);
            createModal.modalWindow.append(createFormClients.formClient);
            createFormClients.formClient.append(changeClientSave);
            createFormClients.formClient.append(changeClientDelete);

            headerText.textContent = 'Изменить данные' + " ";
            headerClientID.textContent = 'ID:' + " " + getClientID;
            changeClientSave.textContent = 'Сохранить';
            changeClientDelete.textContent = 'Удалить клиента';

            headerText.classList.add('modal-text');
            headerClientID.classList.add('head-client-id');
            changeClientSave.classList.add('btn-add-save');
            changeClientDelete.classList.add('btn-cancel');
            headerText.append(headerClientID);
            createFormClients.inputSurname.value = searchClient.surname;
            createFormClients.inputName.value = searchClient.name;
            createFormClients.inputLastName.value = searchClient.lastName;
            searchContact.forEach(item => {
                const contactList = addContactList(item.type);
                contactList.inputContact.value = item.value;
                contactList.contactContainer.classList.add('resize');
            });

            customPlaceholder('input-surname', 'placeholder-surname');
            customPlaceholder('input-name', 'placeholder-name');
            customPlaceholder('input-lastname', 'placeholder-lastname');

            changeClientSave.addEventListener('click', (e) => {
                e.preventDefault();
                validate(createFormClients.inputName, createFormClients.inputSurname, createFormClients.formClient, changeClientSave, changeSaveData);
            });

            changeClientDelete.addEventListener('click', () => {
                deleteModalWindow();
                deleteClientModalWindow();
            });
        }

        function addContactList(value) {

            const contactContainer = document.querySelector('.add-contact-container');
            const btnAddContact = document.querySelector('.btn-add-contact');
            const contactItem = document.createElement('li');
            const selectContact = document.createElement('select');
            const inputContact = document.createElement('input');
            const btnDelete = document.createElement('button');

            const choicesContactPhone = document.createElement('option');
            const choicesContactEmail = document.createElement('option');
            const choicesContactFacebook = document.createElement('option');
            const choicesContactVK = document.createElement('option');
            const choicesContactOther = document.createElement('option');

            contactContainer.insertBefore(contactItem, btnAddContact);
            contactItem.append(selectContact);
            contactItem.append(inputContact);
            contactItem.append(btnDelete);

            selectContact.append(choicesContactPhone);
            selectContact.append(choicesContactEmail);
            selectContact.append(choicesContactFacebook);
            selectContact.append(choicesContactVK);
            selectContact.append(choicesContactOther);

            choicesContactPhone.textContent = 'Телефон';
            choicesContactEmail.textContent = 'E-Mail';
            choicesContactFacebook.textContent = 'Facebook';
            choicesContactVK.textContent = 'VK';
            choicesContactOther.textContent = 'Другое';


            const searchOption = document.querySelectorAll('option');
            searchOption.forEach(el => {
                inputContact.dataset.type = `${value}`;
                maskInputInstall(`${value}`);
                el.value == `${value}` ? el.selected = true : el.selected = false;
            });

            inputContact.placeholder = 'Введите данные';

            contactItem.classList.add('contact-item');
            selectContact.classList.add('select-contact');
            inputContact.classList.add('input-contact');
            btnDelete.classList.add('delete-item-contact');

            selectContact.addEventListener('change', () => {
                if (selectContact.value == 'Телефон') {
                    inputContact.dataset.type = 'Телефон';
                    maskInputInstall('Телефон');
                }
                else if (selectContact.value == 'E-Mail') {
                    inputContact.dataset.type = 'E-Mail';
                    maskInputInstall('E-Mail');
                }
                else if (selectContact.value == 'Facebook') {
                    inputContact.dataset.type = 'Facebook';
                    maskInputInstall('Facebook');
                }
                else if (selectContact.value == 'VK') {
                    inputContact.dataset.type = 'VK';
                    maskInputInstall('VK');
                }
                else if (selectContact.value == 'Другое') {
                    inputContact.dataset.type = 'Другое';
                    maskInputInstall('Другое');
                }
            });

            btnDelete.addEventListener('click', (e) => {
                e.preventDefault();
                let deleteList = e.target.closest(".contact-item");
                const addContact = document.querySelector('.btn-add-contact');
                deleteList.replaceChildren();
                deleteList.remove();
                counterNumber(addContact);
                if (countNumber == 1) {
                    contactContainer.classList.remove('resize');
                }
            });

            selectChoices();

            return {
                contactContainer,
                btnAddContact,
                contactItem,
                selectContact,
                inputContact,
                btnDelete,
                choicesContactPhone,
                choicesContactEmail,
                choicesContactFacebook,
                choicesContactVK,
                choicesContactOther,
            };

        }

        function maskInputInstall(prop, value) {
            let selector = document.querySelectorAll(`[data-type=${prop}]`);
            if (prop == 'Телефон') {
                const im = new Inputmask(`${value}`, { mask: "+7(999)-999-99-99" });
                im.mask(selector);
            } else if (prop == 'E-Mail') {
                const im = new Inputmask(`${value}`, { mask: "*{1,20}[.*{1,20}][.*{1,20}][.*{1,20}]@*{1,20}[.*{2,6}][.*{1,2}]" });
                im.mask(selector);
            } else {
                Inputmask.remove(selector);
            }

            return {
                selector,
                prop,
                value
            };
        }

        function selectChoices() {
            const searchSelect = document.querySelectorAll('.select-contact');
            searchSelect.forEach(el => {
                const choices = new Choices(el, {
                    searchEnable: false,
                    itemSelectText: '',
                    resetScrollPosition: false,
                    position: "bottom",
                    searchEnabled: false,
                });
            });
        }

        function addClient() {
            const getInputSurname = document.querySelector('.input-surname');
            const getInputName = document.querySelector('.input-name');
            const getInputLastname = document.querySelector('.input-lastname');
            const inputContact = document.querySelectorAll('.input-contact');
            const selectContact = document.querySelectorAll('.select-contact');
            let type = null;
            let value = null;
            for (let i = 0; i < selectContact.length; i++) {
                let objectContact = {};
                type = selectContact[i].value;
                value = inputContact[i].value;
                objectContact['type'] = type;
                objectContact['value'] = value;
                contact.push(objectContact);
            }
            client = {
                surname: getInputSurname.value.trim(),
                name: getInputName.value.trim(),
                lastName: getInputLastname.value.trim(),
                contacts: [
                    ...contact,
                ],
            };
        }

        async function postData() {
            let response = await fetch('http://localhost:3000/api/clients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(client),
            });
            deleteModalWindow();
            client = {};
            contact = [];
            getData();
            return await response.json();
        }

        async function getData() {
            await fetch('http://localhost:3000/api/clients')
                .then((receive) => {
                    return receive.json();
                })
                .then((data) => {
                    clientList = data;
                    renderingTable(clientList);
                });
        }

        async function getClientInput(value) {
            await fetch(`http://localhost:3000/api/clients?search=${value}`)
                .then((receive) => {
                    return receive.json();
                })
                .then((data) => {
                    clientInputSearch = data;
                    renderingTable(clientInputSearch);
                });
        }

        async function searchData(value) {
            await fetch(`http://localhost:3000/api/clients/${value}`)
                .then((receive) => {
                    return receive.json();
                })
                .then((data) => {
                    searchClient = data;
                    changeClientModalWindow();
                });
        }

        async function changeSaveData() {
            await fetch(`http://localhost:3000/api/clients/${getClientID}`, {
                method: 'PATCH',
                body: JSON.stringify(client),
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            client = {};
            contact = [];
            deleteModalWindow();
            await getData();
        }

        async function deleteDataClient(value) {
            await fetch(`http://localhost:3000/api/clients/${value}`, { method: 'DELETE' });
            await getData();
        }

        function searchClientInput() {
            createApp.headerInputSearch.oninput = function () {
                function enterText() {
                    getClientInput(createApp.headerInputSearch.value);
                }
                setTimeout(enterText, 300);
            }
        }

        function sortClients(prop) {
            clientList = clientList.sort((a, b) => {
                let sort = a[prop] < b[prop];
                if (state == false) sort = a[prop] > b[prop];
                if (sort) return -1;
            });
            renderingTable(clientList);
        }

        searchClientInput();

        createApp.tableID.addEventListener('click', () => {
            sortClients('id');
            state = !state;
            createApp.tableID.classList.toggle('reverse-ID');
        });

        createApp.tableAbbrName.addEventListener('click', () => {
            sortClients('surname');
            state = !state;
            createApp.tableAbbrName.classList.toggle('reverse-abbr');
        });

        createApp.tableDateCreate.addEventListener('click', () => {
            sortClients('createdAt');
            state = !state;
            createApp.tableDateCreate.classList.toggle('reverse-create');
        });

        createApp.tableDateChanges.addEventListener('click', () => {
            sortClients('updatedAt');
            state = !state;
            createApp.tableDateChanges.classList.toggle('reverse-update');
        });

        function createModalWindow() {
            const blackout = document.createElement('div');
            const modalWindow = document.createElement('div');
            const modalClose = document.createElement('img');
            modalClose.src = "./img/close-modal.svg";
            document.body.append(blackout);
            document.body.append(modalWindow);
            modalWindow.append(modalClose);
            blackout.classList.add('window-blackout');
            modalWindow.classList.add('modal-window');
            modalClose.classList.add('modal-close');

            blackout.addEventListener('click', () => {
                deleteModalWindow();
            });

            modalClose.addEventListener('click', () => {
                deleteModalWindow();
            });

            return {
                blackout,
                modalWindow,
                modalClose,
            };
        }

        function deleteModalWindow() {
            const delModal = document.querySelector('.modal-window');
            const delBlackout = document.querySelector('.window-blackout');
            delModal.replaceChildren();
            delModal.remove();
            delBlackout.remove();
        }

        function deleteClientModalWindow() {
            const createModal = createModalWindow();
            const deleteTextContainer = document.createElement('div');
            const pHead = document.createElement('p');
            const pQuestion = document.createElement('p');
            const acceptDelete = document.createElement('button');
            const cancelDelete = document.createElement('button');

            createModal.modalWindow.append(deleteTextContainer);
            deleteTextContainer.append(pHead);
            deleteTextContainer.append(pQuestion);
            deleteTextContainer.append(acceptDelete);
            deleteTextContainer.append(cancelDelete);

            deleteTextContainer.classList.add('delete-text-container');
            pHead.classList.add('delete-text-head');
            pQuestion.classList.add('delete-text-quest');
            acceptDelete.classList.add('accept-delete-btn');
            cancelDelete.classList.add('cancel-delete-btn');

            pHead.textContent = 'Удалить клиента';
            pQuestion.textContent = 'Вы действительно хотите удалить данного клиента?';
            acceptDelete.textContent = 'Удалить';
            cancelDelete.textContent = 'Отмена';

            acceptDelete.addEventListener('click', () => {
                deleteModalWindow();
                deleteDataClient(getClientID);
            });

            cancelDelete.addEventListener('click', () => {
                deleteModalWindow();
            });

        }

    });


})();