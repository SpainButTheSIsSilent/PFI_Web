let contentScrollPosition = 0;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Views rendering
user = null;
Init_UI();

function Init_UI() {
    initTimeout(120, renderLogout);
    renderLogin();
}
function showWaitingGif() {
    eraseContent();
    $("#content").append($("<div class='waitingGifcontainer'><img class='waitingGif' src='images/Loading_icon.gif' /></div>'"));
}
function eraseContent() {
    $("#content").empty();
}
function saveContentScrollPosition() {
    contentScrollPosition = $("#content")[0].scrollTop;
}
function restoreContentScrollPosition() {
    $("#content")[0].scrollTop = contentScrollPosition;
}
function getFormData($form) {
    const removeTag = new RegExp("(<[a-zA-Z0-9]+>)|(</[a-zA-Z0-9]+>)", "g");
    var jsonObject = {};
    $.each($form.serializeArray(), (index, control) => {
        jsonObject[control.name] = control.value.replace(removeTag, "");
    });
    return jsonObject;
}
function updateHeader(message) {
    $("#header").empty(); // Clear previous content

    let avatar = ``;

    let dropDownMenu = `<div class="dropdown-menu noselect">`;
    
    if (user != null) {
        if (user.Authorizations.readAccess == 2 && user.Authorizations.writeAccess == 2) {
            dropDownMenu +=
                `<span class="dropdown-item" id="adminCmd">
                <i class="menuIcon fa fa-cog mx-2"></i>
                Gestion des usagers
            </span>
    
            <div class="dropdown-divider"></div>`;
        }
        avatar =
            `<i title="Modifier votre profil">
            <div class="UserAvatarSmall" userid="" id="imgAvatar"
            style="background-image:url('${user.Avatar}')"
            title="${user.Name}"></div>
        </i>`;

        dropDownMenu +=
            `<span class="dropdown-item" id="logoutCmd">
            <i class="menuIcon fa fa-sign-out mx-2"></i>
            Déconnexion
        </span>
        <span class="dropdown-item" id="editProfilMenuCmd">
            <i class="menuIcon fa fa-user-edit mx-2"></i>
            Modifier votre profil
        </span>

        <div class="dropdown-divider"></div>

        <span class="dropdown-item" id="listPhotosMenuCmd">
            <i class="menuIcon fa fa-image mx-2"></i>
            Liste des photos
        </span>

        <div class="dropdown-divider"></div>

        <span class="dropdown-item" id="sortByDateCmd">
            <i class="menuIcon fa fa-check mx-2"></i>
            <i class="menuIcon fa fa-calendar mx-2"></i>
            Photos par date de création
        </span>
        <span class="dropdown-item" id="sortByOwnersCmd">
            <i class="menuIcon fa fa-fw mx-2"></i>
            <i class="menuIcon fa fa-users mx-2"></i>
            Photos par créateur
        </span>
        <span class="dropdown-item" id="sortByLikesCmd">
            <i class="menuIcon fa fa-fw mx-2"></i>
            <i class="menuIcon fa fa-user mx-2"></i>
            Photos les plus aiméés
        </span>
        <span class="dropdown-item" id="ownerOnlyCmd">
            <i class="menuIcon fa fa-fw mx-2"></i>
            <i class="menuIcon fa fa-user mx-2"></i>
            Mes photos
        </span>
        
        <div class="dropdown-divider"></div>`;


    }
    else {
        dropDownMenu +=
            `<div class="dropdown-item" id="loginCmd">
            <i class="menuIcon fa fa-sign-in mx-2"></i>
            Connexion
        </div>`;
    }
    dropDownMenu +=
        `<span class="dropdown-item" id="aboutCmd">
        <i class="menuIcon fa fa-info-circle mx-2"></i>
        À propos...
    </span>`;
    dropDownMenu += `</div>`;



    $("#header").append(
        $(`
            <span title="Liste des photos" id="listPhotosCmd">
                <img src="images/PhotoCloudLogo.png" class="appLogo">
            </span>
            <span class="viewTitle">${message}
            </span>
            <div class="headerMenusContainer">
                <span>&nbsp;</span> 
                ${avatar}
                <div class="dropdown ms-auto">
                    <div data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="cmdIcon fa fa-ellipsis-vertical"></i>
                </div>
                ${dropDownMenu}
            </div>
    `));


    $('#listPhotosMenuCmd').on("click", function () {
        renderListePhotos();
    });
    if (user != null) {
        if (user.Authorizations.readAccess == 2 && user.Authorizations.writeAccess == 2) { 
            $('#adminCmd').on("click", async function () {
                renderAdmin();
            });
        }
        $('#logoutCmd').on("click", async function () {
            renderLogout();
        });
        $('#editProfilMenuCmd').on("click", async function () {
            renderProfile();
        });
        $('#imgAvatar').on("click", async function () {
            renderProfile();
        });
        
    }
    else {
        $('#loginCmd').on("click", async function () {
            renderLogin();
        });
    }
    $('#aboutCmd').on("click", function () {
        renderAbout();
    });
    

}

function renderProfile() {
    updateHeader(user ? "Profile" : "Inscription");
    eraseContent();
    saveContentScrollPosition();
    $("#newPhotoCmd").hide();
    let Id = "";
    let VerifyCode = "";
    let Email = "";
    let Name = "";
    let Avatar = "images/no-avatar.png";
    let btnEffacer = "";
    if(user) {
        timeout();
        Id = `<input type="hidden" name="Id" value="${user.Id}">`;
        Email = user.Email;
        Name = user.Name;
        Avatar = user.Avatar;
        VerifyCode = `<input type="hidden" name="VerifyCode" value="${user.VerifyCode}">`;
        btnEffacer = `<div class="cancel"><hr><button class="form-control btn-danger" id="effacerCompte">Effacer le compte</button></div>`
    }
    else
        noTimeout();

    $("#content").append(`
    <form class="form" id="profileForm"'>
        <fieldset>
            <legend>Adresse courriel</legend>
            ${Id}
            ${VerifyCode}
            <input type="email"
                class="form-control Email"
                name="Email"
                id="Email"
                placeholder="Courriel"
                required
                RequireMessage = 'Veuillez entrer votre courriel'
                InvalidMessage = 'Courriel invalide'
                CustomErrorMessage ="Ce courriel est déjà utilisé"
                value="${Email}" />
            <input class="form-control MatchedInput"
                type="text"
                matchedInputId="Email"
                name="matchedEmail"
                id="matchedEmail"
                placeholder="Vérification"
                required
                RequireMessage = 'Veuillez entrez de nouveau votre courriel'
                InvalidMessage="Les courriels ne correspondent pas"
                value="${Email}" />
        </fieldset>
        <fieldset>
            <legend>Mot de passe</legend>
            <input type="password"
                class="form-control"
                name="Password"
                id="Password"
                placeholder="Mot de passe"
                required
                RequireMessage = 'Veuillez entrer un mot de passe'
                InvalidMessage = 'Mot de passe trop court'/>
            <input class="form-control MatchedInput"
                type="password"
                matchedInputId="Password"
                name="matchedPassword"
                id="matchedPassword"
                placeholder="Vérification" required
                InvalidMessage="Ne correspond pas au mot de passe" />
        </fieldset>
        <fieldset>
            <legend>Nom</legend>
            <input type="text"
                class="form-control Alpha"
                name="Name"
                id="Name"
                placeholder="Nom"
                required
                RequireMessage = 'Veuillez entrer votre nom'
                InvalidMessage = 'Nom invalide'
                value="${Name}" />

        </fieldset>
        <fieldset>
            <legend>Avatar</legend>
            <div class='imageUploader'
                name='Avatar'
                newImage='true'
                controlId='Avatar'
                value='${Avatar}'
                imageSrc='${Avatar}'
                waitingImage="images/Loading_icon.gif">
            </div>
        </fieldset>
        <input type='submit' name='submit' id='saveUserCmd' value="Enregistrer" class="form-control btn-primary">
            </form>
        <div class="cancel">
            <button class="form-control btn-secondary" id="abortEditProfileCmd">Annuler</button>
        </div>
        ${btnEffacer}
    `);

    initFormValidation();
    initImageUploaders();
    addConflictValidation(API.checkConflictURL(), 'Email', 'saveUser');
    
    // call back la soumission du formulaire
    $('#profileForm').on("submit", async function (event) {
        let profil = getFormData($('#profileForm'));
        delete profil.matchedPassword;
        delete profil.matchedEmail;
        event.preventDefault();
        if(user) {
            console.log(await API.modifyUserProfil(profil)); 
            if(await API.modifyUserProfil(profil)) {
                user = API.retrieveLoggedUser();
                renderListePhotos();
            }
            else
                renderError();
        }
        else {
            showWaitingGif(); // afficher GIF d’attente
            if(await API.register(profil))
                renderLogin("Votre compe a été créé. Veuillez prendre vos courriels pour réccupérer votre code de vérification qui vous sera demandé lors de votre prochaine connexion", profil.Email, "", "")
            else
                renderError();
        }
    });
    $('#abortEditProfileCmd').on('click', function() {
        if(user)
            renderListePhotos();
        else
            renderLogin();
    });

    if(user) {
        $('#effacerCompte').on("click", function (event) {
            renderDelete();
        });
    }
}

function renderLogin(loginMessage = "", Email = "", EmailError = "", passwordError = "") {
    showWaitingGif();
    noTimeout();
    saveContentScrollPosition();
    eraseContent();
    updateHeader("Connexion");

    $("#content").append(
        $(`
    <div class="content" style="text-align:center">
    <h3>${loginMessage}</h3>
    <form class="form" id="loginForm">
    <input type='email'
    name='Email'
    class="form-control"
    required
    RequireMessage = 'Veuillez entrer votre courriel'
    InvalidMessage = 'Courriel invalide'
    placeholder="Adresse courriel"
    value='${Email}'>
    <span style='color:red'>${EmailError}</span>
    <input type='password'
    name='Password'
    placeholder='Mot de passe'
    class="form-control"
    required
    RequireMessage = 'Veuillez entrer votre mot de passe'>
    <span style='color:red'>${passwordError}</span>
    <input type='submit' name='submit' value="Entrer" class="form-control btn-primary">
    </form>
    <div class="form">
    <hr>
    <button class="form-control btn-info" id="createProfilCmd">Nouveau compte</button>
    </div>
    </div>
    `));

    $('#loginForm').on("submit", async function (event) {
        let data = getFormData($("#loginForm"))
        showWaitingGif();
        event.preventDefault();
        try {
            user = await API.login(data.Email, data.Password);
            
            if(user) {
                if(user.VerifyCode != 'verified')
                    renderAccountVerification();
                else
                    renderListePhotos();
            }
            else {
                user = null;
                if (API.currentStatus == 481)
                    renderLogin("", Email = data.Email, EmailError = "Courriel introuvable");
                else if (API.currentStatus == 482)
                    renderLogin("", Email = data.Email, "", passwordError = "Mot de passe incorrecte");
                else
                    renderError();
            }

        } catch (error) {
            console.log(error);
        }
    });
    $('#createProfilCmd').on("click", async function () {
        renderProfile();
    });
}

function renderAccountVerification() {
    showWaitingGif();
    noTimeout();
    saveContentScrollPosition();
    eraseContent();
    updateHeader("Vérification");

    $("#content").append($(`<div class="content" style="text-align:center">
    <h3>Veuillez Entrez le code de vérification que vous avez reçu par courriel</h3>
        <form class="form" id="verifForm">
            <input type='text'
                name='code'
                class="form-control"
                required
                RequireMessage='Code de vérification de courriel'
                InvalidMessage='Code invalide'
                placeholder="Code de vérification de courriel"
        </form>
        <span id="verificationCodeError" style='color:red'></span>
    <div class="form">
        <hr>
        <button class="form-control btn-info" id="VérifierCodeCmd">Vérifier</button>
    </div>
    `));

    $('#VérifierCodeCmd').on("click", async function (event) {
        $('#verificationCodeError').text('');
        event.preventDefault(); 

        if( await API.verifyEmail(user.Id, $('#verifForm input[name="code"]').val()))
                renderListePhotos();
        else
            $('#verificationCodeError').text("Le code n'est pas correct.");
    });
}

function renderDelete(selectedUser = false) {
    showWaitingGif();
    timeout();
    updateHeader("Retrait de compte");
    eraseContent();
    let message = "Voulez-vous vraiment effacer votre compte ?";
    let avatar = "";
    let nom = "";
    let email = "";
    let effacer = "Effacer mon compte";
    let self = true;
    if(selectedUser) {
        message = "Voulez-vous vraiment effacer cet usager et toutes ses photos ?";
        avatar = `class='imageUploader' imageSrc='${selectedUser.Avatar}'`;
        nom = `${selectedUser.Name}`;
        email = `<a href="${selectedUser.Email}">${selectedUser.Email}</a>`;
        effacer = "Effacer";
        self = false;
    }
    else
        selectedUser = user;
    

    $("#content").append($(`
        <div class="content" style="text-align:center"><h2>${message}</h2>
            <div ${avatar}>
            </div>
            <span>    
                ${nom}
                ${email}
            </span>
            <div class="cancel">
                <hr>
                <button class="form-control btn-danger" id="effacerCompte">${effacer}</button>
            </div>
            <br>
            <div class="cancel">
            <button class="form-control btn-secondary" id="abortCmd">Annuler</button>
            </div>
            </div>
    `));
    $('#effacerCompte').on("click", function (event) {
        API.unsubscribeAccount(selectedUser.Id).then(() => {
            if(self)
                renderLogout();
            else
                renderAdmin();
        })
        .catch(error => {
            renderError(error);
        });
    });
    $('#abortCmd').on("click", function (event) {
        if(user.Authorizations.readAccess == 2 && user.Authorizations.writeAccess == 2)
            renderAdmin();
        else
            renderProfile();
    });

}

function renderListePhotos() {
    showWaitingGif();
    timeout();
    saveContentScrollPosition();
    eraseContent();
    updateHeader("Liste des photos");

    $("#content").append($(`<div class="content" style="text-align:center"><h3>Félicitations, vous êtes connecté !</h3>`));

}

function renderLogout() {
    API.logout()
    .then(() => {
        user = null;
        renderLogin("Déconnexion réussie", "", "", "");
    })
    .catch(error => {
        renderError();
    });
}

function renderAbout() {
    showWaitingGif();
    if(user)
        timeout();
    else
        noTimeout();
    saveContentScrollPosition();
    eraseContent();
    updateHeader("À propos...");

    $("#content").append(
        $(`
            <div class="aboutContainer">
                <h2>Gestionnaire de photos</h2>
                <hr>
                <p>
                    Petite application de gestion de photos multiusagers à titre de démonstration
                    d'interface utilisateur monopage réactive.
                </p>
                <p>
                    Auteur: Maxim Tchapalo, Louis Savard
                </p>
                <p>
                    Collège Lionel-Groulx, automne 2023
                </p>
            </div>
        `))
}

async function renderAdmin() {
    showWaitingGif();
    timeout();
    saveContentScrollPosition();
    eraseContent();
    updateHeader("Gestion des usagers");

    let usersData = await API.GetAccounts();

    if(usersData) {
        usersData.data.forEach(userData => {
            if (userData.Id != user.Id) {
                let typeIcon = userData.Authorizations.readAccess == 2 ? "fas fa-user-cog" : "fas fa-user-alt";
                let typeTitle = userData.Authorizations.readAccess == 2 ? "Retirer le droit administrateur à" : "Octroyer le droit administrateur à";
                let blockedClass = userData.Authorizations.readAccess == -1 ? "class='blockUserCmd cmdIconVisible fa fa-ban redCmd'" : "class='blockUserCmd cmdIconVisible fa-regular fa-circle greenCmd'";
                let blockedTitle = userData.Authorizations.readAccess == -1 ? "Débloquer" : "Bloquer";
                let promoteUserCmdId = `promoteUserCmd_${userData.Id}`;
                let blockUserCmdId = `blockUserCmd_${userData.Id}`;
                let removeUserCmdId = `removeUserCmd_${userData.Id}`;
                
                let userRow = `
                    <div class="UserRow">
                        <div class="UserContainer noselect">
                            <div class="UserLayout">
                                <div class="UserAvatar" style="background-image:url('${userData.Avatar}')" title="${userData.Name}"> </div>
                                <div class="UserInfo">
                                    <span class="UserName">${userData.Name}</span>
                                    <a href="mailto:${userData.Email}" class="UserEmail" target="_blank">${userData.Email}</a>
                                </div>
                            </div>
                            <div class="UserCommandPanel">
                            <span id="${promoteUserCmdId}" class="promoteUserCmd cmdIconVisible ${typeIcon} dodgerblueCmd" title="${typeTitle} ${userData.Name}" id="${promoteUserCmdId}" userId="${userData.Id}"> </span>
                            <span id="${blockUserCmdId}" class="${blockedClass}" title="${blockedTitle} ${userData.Name}" id="${blockUserCmdId}" userId="${userData.Id}"> </span>
                            <span class="removeUserCmd cmdIconVisible fas fa-user-slash goldenrodCmd" title="Effacer ${userData.Name}" id="${removeUserCmdId}" userId="${userData.Id}"> </span>
                            </div>
                        </div>
                    </div>`;
                $("#content").append(userRow);

                $(`#${promoteUserCmdId}`).on("click", async function () {
                    if(await API.modifyAdmin(userData.Id))
                        renderAdmin();
                    else
                        renderError();
                });
                $(`#${blockUserCmdId}`).on("click", async function () {
                    if(await API.modifyBlock(userData.Id))
                        renderAdmin();
                    else                    
                        renderError();
                });
                $(".removeUserCmd").on("click", function () {
                    renderDelete(userData);
                });
            }
        });
    }
    else
        renderError();

} 
function renderError(message="Le serveur ne répond pas") {
    showWaitingGif();
    noTimeout();
    saveContentScrollPosition();
    eraseContent();
    updateHeader("Gestion des usagers");
    user = null;
    $("#content").append($(`
        <div class="content" style="text-align:center">
            <h2>${message}</h2>
            <div class="cancel"><hr><button class="form-control btn-primary" id="connexion">Connexion</button></div>
        </div>
    `));

    $("#connexion").on("click", function () {
        renderLogin();
    });
}