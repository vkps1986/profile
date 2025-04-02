/**
 *
 * @param {domElement} element
 * @param {object} compInfo
 */
function updateCommonAttribute(element, compInfo)
{
    if (compInfo.id)
        element.setAttribute('id', compInfo.id);
    if (compInfo.class)
        element.setAttribute('class', compInfo.class);
    if (compInfo.name)
        element.setAttribute('name', compInfo.name);
    if(compInfo.style)
        element.setAttribute('style', compInfo.style);
    if(compInfo.title)
        element.setAttribute("title", compInfo.title);
}

var TextComponent = function (compInfo)
{
    var text  = document.createElement("input");
    updateCommonAttribute(text, compInfo);
    text.setAttribute('type', 'text');

    if(compInfo.defaultValue)
        text.setAttribute('value', compInfo.defaultValue);
    if(compInfo.placeholder)
        text.setAttribute('placeholder', compInfo.placeholder);
    if (compInfo.autocomplete)
        text.setAttribute('autocomplete', compInfo.autocomplete);
    if(compInfo.isEditable == false)
        text.disabled = true;

    return text;
};

var toggleButtonComponent = function (compInfo) {

    let e_label = document.createElement("label");
    e_label.classList.add("switch");
    e_label.classList.add("switch-xs");
    e_label.classList.add("cygnetToggle");

    var checkbox = document.createElement("input");
    updateCommonAttribute(checkbox, compInfo);
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("id", compInfo.name);

    if(compInfo.defaultValue == "true")
          checkbox.setAttribute("checked", "true");

    e_label.appendChild(checkbox);

    let i = document.createElement("i");
    e_label.appendChild(i);

    return e_label;
}

var FloatingComboComponent = function (chosenInput) {
    let div = createDivElement({id:"", class:"form-field"});
    let divElement = createDivElement({id:"" , class:"form-field__control"});
    let labelComponent = new LabelComponent({ innerText:chosenInput.placeholder, class:"form-field__label"});
    $(labelComponent).css("z-index", "1");
    let select = new SelectBoxComp(chosenInput);
    select.setAttribute("data-placeholder", " ");

    if(chosenInput.required) {
        var requiredSpan = new spanElement({class: "required-span"});
        $(requiredSpan).css("z-index", "1");
        requiredSpan.innerText = "*";
        divElement.append(requiredSpan);
    }

    divElement.append(labelComponent);
    divElement.append(select);

    if (chosenInput.error) {
        let comboErrorDiv = createDivElement({id: chosenInput.id + "Error", class: "form-field__errorDiv"});
        var span = new spanElement({class: "fa fa-exclamation-circle"});
        span.id = "alertIcon";
        span.style.color = "var(--cygnet-error)";
        span.style.paddingTop = "8px";
        span.style.paddingLeft = "5px";
        let errorLabel = new LabelComponent({innerText: chosenInput.error, class: "form-field__error"});
        comboErrorDiv.append(span);
        comboErrorDiv.append(errorLabel);
        divElement.append(comboErrorDiv);
    }
    div.append(divElement);

    if (chosenInput.showDefaultValue)
        div.classList.add("form-field--is-filled");

    if (chosenInput.disable)
        select.disabled = true;
    let width = (chosenInput.width) ? chosenInput.width : "100%";
    let chosenBox = $(select).chosen({
        width: width,
        inherit_select_classes : true
    });
    $(chosenBox).change(function ()
    {
        div.classList.add("form-field--is-filled");
        if(chosenInput.onChangeMethod)
            chosenInput.onChangeMethod(this, chosenInput.onChangeInput);
    });
    return div;
};

var FloatingLabelElement = function (input) {
    let div = createDivElement({id:"", class:"form-field"});
    let divElement = createDivElement({id:"" , class:"form-field__control"});
    let labelComponent = new LabelComponent({ innerText:input.label, class:"form-field__label"});
    let textFieldComponent;
    if(input.textarea) {
        textFieldComponent = createElementWithIdandClass("textarea", input.id,"form-field__input");
        textFieldComponent.setAttribute("style","max-width: 171px; height:60px; width: 183px; padding:8px 11px; border: var( --cygnet-combo-borderColor); ");

    }
    else {
        textFieldComponent = new TextComponent({
            id: input.id,
            style:"padding:1px 11px; width: 171px; border: var( --cygnet-combo-borderColor);",
            class: "form-field__input",
            defaultValue: input.defaultValue,
            isEditable: input.editable,
        });
        textFieldComponent.setAttribute("autocomplete", "off");
    }

    textFieldComponent.onfocus = function () {
        setTextField(this, true);
    };
    textFieldComponent.onblur = function () {
        setTextField(this, false);
    };
    if (input.required){
        var requiredSpan = new spanElement({class:"required-span"});
        requiredSpan.innerText = "*";
        divElement.append(requiredSpan);
    }

    let errorDiv = createDivElement({id : input.id + "Error", class:"form-field__errorDiv" });
    var errorSpan = new spanElement({class: "fa fa-exclamation-circle"});
    errorSpan.id = "alertIcon";
    errorSpan.style.color = "var(--cygnet-error)";
    errorSpan.style.paddingTop = "8px";
    errorSpan.style.paddingLeft = "5px";
    let errorLabel = new LabelComponent({id : input.errorId, innerText: input.error, class:"form-field__error"});
    errorDiv.append(errorSpan);
    errorDiv.append(errorLabel);

    divElement.append(labelComponent);
    divElement.append(textFieldComponent);
    divElement.append(errorDiv);
    div.append(divElement);
    return div;
};

var setTextField = (textFieldInput, active) => {
    const formField = textFieldInput.parentNode.parentNode;
    if (active) {
        formField.classList.add('form-field--is-active')
    } else {
        formField.classList.remove('form-field--is-active');
        textFieldInput.value === '' ?
            formField.classList.remove('form-field--is-filled') :
            formField.classList.add('form-field--is-filled')
    }
};


var ComboBoxComponent = function (compInfo)
{
    var selectList = document.createElement("select");

    updateCommonAttribute(selectList, compInfo);
    var array = compInfo.options;
    for (var i = 0; i < array.length; i++) {
        var option = document.createElement("option");
        option.setAttribute("value", array[i]);
        option.text = array[i];

        if(array[i] == compInfo.defaultValue)
            option.setAttribute("selected", true);

        selectList.appendChild(option);
    }
    return selectList;
};

var PasswordComponent = function (compInfo)
{
    var pass  = document.createElement("input");
    updateCommonAttribute(pass, compInfo);
    pass.setAttribute('type', 'password');
    pass.setAttribute('value', compInfo.defaultValue);
    return pass;
};

var ColorComponent = function (compInfo)
{
    var color  = document.createElement("input");
    updateCommonAttribute(color, compInfo);
    color.setAttribute('type', 'color');
    color.setAttribute('value', compInfo.defaultValue);
    return color;
};

var SpinnerComponent = function (compInfo)
{
    var spinner  = document.createElement("input");
    updateCommonAttribute(spinner, compInfo);
    spinner.setAttribute('type', 'number');
    spinner.setAttribute('value', compInfo.defaultValue);
    spinner.setAttribute('min', compInfo.min);
    spinner.setAttribute("max", compInfo.max);
    spinner.setAttribute('step', compInfo.step);
    return spinner;
};

var ButtonComponent = function(id, label, style, isCancelOrCloseButton, isSuccessbutton)
{
    var button = document.createElement('button');
    button.setAttribute('type', 'button');
    if (isCancelOrCloseButton)
    {
        button.classList.add('btn', 'btn-default');
    }
    else if(isSuccessbutton) {
        button.classList.add('btn', 'btn-success');
    }
    else{
        button.classList.add('btn-primary');
        button.classList.add("cygnetButton");
    }
    button.classList.add('btn_small');
    button.setAttribute('id', id);
    button.style = style;
    var t = document.createTextNode(label);
    button.appendChild(t);
    return button;
};

function createDivElement(compInfo)
{
    var div = document.createElement("div");
    updateCommonAttribute(div, compInfo);
    return div;
}


var LabelComponent = function (compInfo)
{
    var label_comp = document.createElement("label");
    updateCommonAttribute(label_comp, compInfo);

    if(compInfo.innerText)
        label_comp.innerText = compInfo.innerText;
    if(compInfo.for)
        label_comp.for = compInfo.for;

    return label_comp;
}

var DateCompInKeyValue = function(compInfo)
{
    var date_input  = document.createElement("input");

    updateCommonAttribute(date_input,compInfo);
    date_input.setAttribute('type', 'text');
    date_input.setAttribute('data-provide','datepicker');
    date_input.setAttribute('data-date-format',compInfo.input.format);
    date_input.setAttribute('value',compInfo.defaultValue);
    date_input.setAttribute('class', "form-control" );
    date_input.setAttribute('style',"box-shadow: none !important;padding: 1px;");
    date_input.setAttribute('readonly','readonly');
    return date_input;
};

var DateComp = function(id, defaultSelectedDate, minDate, maxDate)
{
    var mainDiv = createDivElement({class:'input-group date'});
    var date_input  = document.createElement("input");
    date_input.setAttribute('type', 'datetime-local');
    date_input.setAttribute('class', "form-control input-sm" );
    date_input.setAttribute('id', id);
    date_input.setAttribute("style", "height: 27px; border-radius: 5px;");
    if (defaultSelectedDate) {
        defaultSelectedDate = convertDateCompFormat(defaultSelectedDate);
        date_input.setAttribute("value", defaultSelectedDate);
    }
    if (minDate) {
        minDate = convertDateCompFormat(minDate);
        date_input.setAttribute("min", minDate);
    }
    if (maxDate) {
        maxDate = convertDateCompFormat(maxDate);
        date_input.setAttribute("max", maxDate);
    }
    /*var main_span = document.createElement('span');
    main_span.setAttribute('id', calSpan_Id);
    main_span.setAttribute('class', "input-group-addon");

    var cal_span = document.createElement('span');
    cal_span.setAttribute('id', "calSpan-Id");
    cal_span.setAttribute('class', "fa fa-calendar");*/


    // main_span.appendChild(cal_span);
    mainDiv.appendChild(date_input);
    // mainDiv.appendChild(main_span);
    // applyDateTimePicker(mainDiv, date_Value, format, disableFutureDate);
    return mainDiv;
};

function convertDateCompFormat(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;

    return formattedDate;
}

var DateCompBS4 = function(id, date_Value, calSpan_Id, format,disableFutureDate)
{
    var mainDiv = createDivElement({class:'input-group date'});
    var date_input  = document.createElement("input");
    date_input.setAttribute('type', 'text');
    date_input.setAttribute('class', "form-control input-sm" );
    date_input.setAttribute('id', id);

    var spanDiv  = document.createElement("div");
    spanDiv.setAttribute('class', "input-group-append" );

    var main_span = document.createElement('span');
    main_span.setAttribute('id', calSpan_Id);
    main_span.setAttribute('class', "input-group-text");

    var cal_span = document.createElement('span');
    cal_span.setAttribute('id', "calSpan-Id");
    cal_span.setAttribute('class', "fa fa-calendar");


    main_span.appendChild(cal_span);
    mainDiv.appendChild(date_input);
    spanDiv.appendChild(main_span);
    mainDiv.appendChild(spanDiv);
    applyDateTimePicker(mainDiv, date_Value, format, disableFutureDate);
    return mainDiv;
}


function applyColorToCalSpan(calSpanId)
{
    let cal_element = document.getElementById(calSpanId);

    $("#"+calSpanId).mouseover(function()
    {
        cal_element.setAttribute("style","background-color: lightgray !important");
    });

    $("#"+calSpanId).mouseout(function()
    {
        cal_element.setAttribute("style","background-color: white !important");
    });
}

function applyDateTimePicker(dateDiv, defaultDate,format, disableFutureDate,minDate)
{
    if(!format)
        format='YYYY-MM-DD HH:mm:ss';
    let maxDate;
    if (disableFutureDate)
        maxDate = new Date();

    $(dateDiv).datetimepicker(
        {
            useCurrent: false ,
            defaultDate: defaultDate,
            format: format,
            icons: {
                time: "fa fa-clock-o",
                date: "fa fa-calendar",
                up: "fa fa-arrow-up",
                down: "fa fa-arrow-down",
                previous:"fa fa-arrow-left",
                next:"fa fa-arrow-right"
            },
            ignoreReadonly: true,
            maxDate : maxDate,
            minDate : minDate
        });
}


var PopupDialog = function (mainId, contentId, headerTitle)
{
   var popup = createDivElement({id:mainId, class:'modal fade'});
    popup.setAttribute('role', 'dialog');

    var dialog = createDivElement({id:'', class:'modal-dialog'});

    var content = createDivElement({id:'', class:'modal-content', style:"width:125%;margin-left:-15%"});
    dialog.appendChild(content);

    var header = createDivElement({id:'', class:'modal-header', style:"border-bottom:none !important;"});

    var h4 = document.createElement("h4");
    h4.class = "modal-title";
    h4.style = "color: var(--cygnet-panel-headerFontColor) !important;border-bottom: none !important; background-color:  var(--cygnet-panel-headerBGColor) !important;letter-spacing: var(--cygnet-panel-header-letterSpacing);";
    h4.innerHTML = headerTitle;
    header.appendChild(h4);

    var closeBtn = new CloseButton();
    h4.appendChild(closeBtn);

    var popupObj = createDivElement({id:contentId, class:'modal-body', style: "width: 100%;margin-bottom:-5%;"})

    var modal_footer = createDivElement({id:"", class:"modal-footer", style:"border-top: none !important;"});

    content.appendChild(header);
    content.appendChild(popupObj);
    content.appendChild(modal_footer);
    popup.appendChild(dialog);



    return popup;
};

var CloseButton = function ()
{
    var closBtn = document.createElement('button');
    closBtn.setAttribute('type', 'button');
    closBtn.setAttribute('class', 'close');
    closBtn.setAttribute('title', 'Close');
    closBtn.setAttribute('data-dismiss', 'modal');
    closBtn.setAttribute('aria-hidden', 'true');
    closBtn.style = "font-size:15px";
    var t = document.createTextNode('x');
    closBtn.appendChild(t);
    return closBtn;
};

function openLobiPanelInNewWindow(uniquePageId, titleId, contentId)
{
    var panel = createDivElement({id:uniquePageId});
    panel.setAttribute('class', 'panel panel-default');

    $('#content').append(panel);

    var panelHead = createDivElement({class: 'panel-heading'});
    panel.appendChild(panelHead);

    var titleBar = createDivElement({id:titleId, class:'panel-title'});
    panelHead.appendChild(titleBar);

    var content = createDivElement({id:contentId, class: 'panel-body'});
    panel.appendChild(content);

    $('#' + uniquePageId).lobiPanel(
        {
            reload: false,
            editTitle: false,
            unpin: false,
            minimize: {
                icon: 'fa fa-chevron-up',
                icon2: 'fa fa-chevron-down'
            },
            close: {
                icon: 'fa fa-times-circle'
            },
            expand: {
                icon: 'fa fa-expand',
                icon2: 'fa fa-compress',
                tooltip:'ToggleScreen'
            },

        minWidth: 1000,
        minHeight: 480,
        maxWidth: 1000,
        maxHeight: 600
    });
}

function getLobiPanelComponent(panelId, titleId, contentId)
{
    var panel = createDivElement({id:panelId});
    panel.setAttribute('class', 'panel panel-default cygnet-panel');
    var panelHead = createDivElement({class: 'panel-heading'});
    panel.appendChild(panelHead);

    var titleBar = createDivElement({id:titleId, class:'panel-title lobiPanelTitle'});
    panelHead.appendChild(titleBar);

    var content = createDivElement({id:contentId, class: 'panel-body lobiPanelContent'});
    panel.appendChild(content);
    return panel;

   /* $('#'+panelId).lobiPanel({
        reload: false,
        editTitle: false,
        unpin: false,
        minimize: false,
        expand: {
            icon: 'fa fa-expand',
        }
    });*/
}
function createElementWithIdandClass(element, id, classString) {
    let el = document.createElement(element);
    if(id)
        el.setAttribute("id",id);
    if(classString)
        el.setAttribute("class",classString);

    return el;
}


/*List of Object Structure : {tabName : "sample Name" , action:"jsMethodName" , actionInputs:["arg1","arg2"]}
*
* */
// works for bootstrap version 3
var createTabbedPane = function (listofobject,iddd, additionalInfo) {
    this.appendNewTab = function (object, k) {
        this.appendTabINULContainer(object, k);
        this.appendTabContainerINTabContent(object, k);

        if (additionalInfo && additionalInfo['emptyPanel'])
            checkAndShowEmptyContent();
    }

    this.appendTabINULContainer = function (obj, k) {
        let liEl = createElementWithIdandClass("li", "", "nav-item");
        let link = createElementWithIdandClass("a", "", "nav-link");
        link.setAttribute("data-toggle","tab");
        link.setAttribute("href","#" + obj.id);
        link.setAttribute("style", "box-shadow:none !important");

        let textSpan = createElementWithIdandClass("span", "", "");
        textSpan.style = "display:inline-block;";
        textSpan.title = obj.tabName;
        textSpan.appendChild(document.createTextNode(obj.tabName));

        link.appendChild(textSpan);

        if (additionalInfo && additionalInfo['isClosable'])
            addCloseSpanForTab(link, obj.id);

        if(k == 0)
        {
            liEl.classList.add("active");
            link.classList.add("active");
        }

        liEl.appendChild(link);

        link.addEventListener('dblclick', function () {
            if (additionalInfo && additionalInfo['isTabNameEditable'])
                makeTabNameEditable(textSpan);
        });

        ulContainer.appendChild(liEl);

        $(liEl).click(()=>{
            if (obj.callback) {
                if (typeof obj.callback === 'string')
                    window[obj.callback]({ li: liEl, info: obj});
                else if (typeof obj.callback === 'function')
                    obj.callback({ li: liEl, info: obj});
            }
        });

        return liEl;
    }

    this.appendTabContainerINTabContent = function (object, l) {
        let isActiveNotNeeded = additionalInfo && additionalInfo['activeNotReqForChild'];
        let activeClass = (isActiveNotNeeded) ? '' : 'active';
        let tabDiv = createDivElement({id:object.id, class:"tab-pane fade " + activeClass, style:"width:100%"});
        if(l == 0)
            tabDiv.setAttribute("class", "tab-pane fade in active");

        tabDivContainer.appendChild(tabDiv);
        if(object.action)
            window[object.action](object, object.id);
    }

    let mainContainer = createElementWithIdandClass("div","tabbedPaneMainContainer","container");
    mainContainer.setAttribute("style","padding:0px;margin:0px;margin-top:1%;max-width:none;width:100%");

    (typeof iddd === "string") ? $('#' + iddd).append(mainContainer) : $(iddd).append(mainContainer);

    let navsContainer = createDivElement({class:"navs-list"});
    mainContainer.append(navsContainer);
    let arrowLeftContainer = createDivElement({class: "scroller scroller-left"});
    let arrowLeft = ce('i');
    arrowLeft.className = "fa fa-chevron-left";
    arrowLeftContainer.append(arrowLeft);
    let arrowRightContainer = createDivElement({class: "scroller scroller-right"});
    let arrowRight = ce('i');
    arrowRight.className = "fa fa-chevron-right";
    arrowRightContainer.append(arrowRight);
    let wrapper = createDivElement({class: "navs-wrapper"});
    navsContainer.append(arrowLeftContainer);
    navsContainer.append(wrapper);
    navsContainer.append(arrowRightContainer);

    let ulContainer = createElementWithIdandClass("ul","","nav nav-tabs list");
    let tabDivContainer = createDivElement({id:"tabDivContainer",class:"tab-content", style:"width:100%"});

    if (additionalInfo && additionalInfo['isScrollable']){
        $(arrowLeftContainer).show();
        $(arrowRightContainer).show();
        $(ulContainer).css('flex-wrap', 'nowrap');
    }

    wrapper.appendChild(ulContainer);
    mainContainer.appendChild(tabDivContainer);

    for(let k in listofobject){
        this.appendNewTab(listofobject[k], k);
    }

    if (additionalInfo && additionalInfo['emptyPanel'])
        checkAndShowEmptyContent();

    function addCloseSpanForTab(link, id) {
        let closeIcon = ce('span');
        closeIcon.setAttribute('name', id);
        closeIcon.setAttribute('class', 'fa fa-times');
        closeIcon.setAttribute('style', 'margin-left:5px; padding:4px;');
        link.appendChild(closeIcon);

        $(closeIcon).click((event)=>{
            event.preventDefault();
            let tabId = $(closeIcon).parents('a').attr('href');
            let $closedLi = $(closeIcon).parents('li');
            let isActive = $closedLi.hasClass('active');
            let closedTabIndex = $(ulContainer).find('li').index($closedLi);
            $closedLi.remove();
            $(tabId).remove();

            if (!isActive) return;
            let leftTabIndex = Math.max(0, closedTabIndex - 1);

            let leftTabAnchor = $(ulContainer).find('li').eq(leftTabIndex).find('a');
            leftTabAnchor.tab('show');

            if (additionalInfo && additionalInfo['emptyPanel'])
                checkAndShowEmptyContent();
        });
    }

    function makeTabNameEditable(textSpan) {
        let oldText = textSpan.textContent;

        let modal = createModal('Set Title', 'Title :', oldText);

        $(modal).modal('show');

        $(modal).on('shown.bs.modal', function () {
            $(modal).find('input').focus();
            $(modal).find('input').select();
        });

        let inputElement = modal.querySelector('input');

        $(modal).find('.save-btn').on('click', function () {
            let newText = inputElement.value.trim();
            if (newText === '') {
                textSpan.textContent = oldText;
            } else {
                textSpan.textContent = newText;
                textSpan.title = newText;
            }

            $(modal).modal('hide');
        });

        $(modal).find('.cancel-btn').on('click', function () {
            textSpan.textContent = oldText;
            $(modal).modal('hide');
        });

        $(inputElement).on('keydown', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                $(modal).find('.save-btn').click();
            }
        });
    }

    function createModal(title, label, defaultValue) {
        let modal = createElementWithIdandClass("div", "", "modal fade");
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                        <h4 class="modal-title" align="left">${title}</h4>
                    </div>
                    <div class="modal-body" style="display: flex; align-items: center; gap: 10px;">
                        <label style="text-align: center; white-space: nowrap">${label}</label>
                        <input type="text" class="form-control" value="${defaultValue}">
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary save-btn">Save</button>
                        <button type="button" class="btn btn-secondary cancel-btn" data-dismiss="modal">Cancel</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        return modal;
    }

    function showEmptyContentMessage() {
        let emptyContent = createDivElement({ class: "empty-content", style:"display:flex;align-items:center;justify-content:center;min-height:inherit;justify-content:center;" });
        emptyContent.appendChild(additionalInfo['emptyPanel']);
        tabDivContainer.appendChild(emptyContent);
    }

    function hideEmptyContentMessage() {
        let emptyContent = tabDivContainer.querySelector(".empty-content");
        if (emptyContent) {
            tabDivContainer.removeChild(emptyContent);
        }
    }

    function checkAndShowEmptyContent() {
        if ($(ulContainer).find('li').length === 0) {
            showEmptyContentMessage();
        } else {
            hideEmptyContentMessage();
        }
    }

    $(arrowRightContainer).click(function () {
        scrollTabs("right");
    });

    $(arrowLeftContainer).click(function () {
        scrollTabs("left");
    });

    let scrollPosition = 0;

    function scrollTabs(direction) {
        const tabWidth = 150*3; // Adjust this value based on your tab width
        const maxScroll = ulContainer.scrollWidth - ulContainer.clientWidth;

        if (direction === 'left' && scrollPosition > 0) {
            scrollPosition -= tabWidth;
        } else if (direction === 'right' && scrollPosition < maxScroll) {
            scrollPosition += tabWidth;
        }

        if (direction === 'left' && scrollPosition < 0){
            scrollPosition = 0;
        } else if (direction === 'right' && scrollPosition > maxScroll) {
            scrollPosition = maxScroll;
        }

        ulContainer.style.transform = `translate3d(${-scrollPosition}px, 0, 0)`;
    }


}

function createTabbedPaneForDomAsInput(listofobject, iddd, tabDiv, divToAppend) {

    let mainContainer = createElementWithIdandClass("div","tabbedPaneMainContainer","container");

    $('#' + iddd).append(mainContainer)

    let ulAndAdditionalDivContainer = document.createElement('div');
    ulAndAdditionalDivContainer.style.display = "flex";
    ulAndAdditionalDivContainer.style.gap = "10px";
    mainContainer.appendChild(ulAndAdditionalDivContainer);
    let ulContainer = createElementWithIdandClass("ul","","nav nav-tabs tab-UL");

    for(let k in listofobject){
        let obj = listofobject[k];

        let liEl = createElementWithIdandClass("li");
        if(k == 0)
            liEl.setAttribute("class","active")
        let link = createElementWithIdandClass("a");
        link.setAttribute("data-toggle","tab");
        link.setAttribute("href","#" + obj.id);
        link.setAttribute("style", "box-shadow:none !important;color:rgb(95, 152, 222) !important;border-bottom:none!important;");
        link.appendChild(document.createTextNode(obj.tabName))
        liEl.appendChild(link)

        ulContainer.appendChild(liEl);
    }

    let tabDivContainer =  tabDiv;//createDivElement({id:"tabDivContainer",class:"tab-content", style:"width:100%"});

    ulAndAdditionalDivContainer.appendChild(ulContainer);
    if(divToAppend) {
        ulAndAdditionalDivContainer.appendChild(divToAppend);
    }

    mainContainer.appendChild(tabDivContainer);

    mainContainer.setAttribute("style","padding:0px;margin:0px;margin-top:1%;max-width:none;width:100%");

}

function createTabbedPaneBootstrapV4(listofobject, iddd) {

    let mainContainer = createElementWithIdandClass("div","tabbedPaneMainContainer","container");

    $('#' + iddd).append(mainContainer)

    let ulContainer = createElementWithIdandClass("ul","","nav nav-tabs")

    for(let k in listofobject){
        let obj = listofobject[k];

        let liEl = createElementWithIdandClass("li", "", "nav-item");
        let link = createElementWithIdandClass("a", "", "nav-link");
        link.setAttribute("data-toggle","tab");
        link.setAttribute("href","#" + obj.id);
        link.setAttribute("style", "box-shadow:none !important");
        link.appendChild(document.createTextNode(obj.tabName))

        if(k == 0)
        {
            liEl.classList.add("active");
            link.classList.add("active");
        }

        liEl.appendChild(link)

        ulContainer.appendChild(liEl);
    }

    let tabDivContainer = createDivElement({id:"tabDivContainer",class:"tab-content", style:"width:100%"});

    mainContainer.appendChild(ulContainer);
    mainContainer.appendChild(tabDivContainer);

    for(let l in listofobject){

        let object = listofobject[l];
        let tabDiv = createDivElement({id:object.id, class:"tab-pane fade active", style:"width:100%"});
        if(l == 0)
            tabDiv.setAttribute("class", "tab-pane fade active show");

        tabDivContainer.appendChild(tabDiv);
        if(object.action)
            window[object.action](object, object.id);
    }


    mainContainer.setAttribute("style","padding:0px;margin:0px;margin-top:1%;max-width:none;width:100%");

}

function tabPaneSampleCall(argList,divIdToBeUsed) {

    let hh = document.createElement("h3");
    hh.appendChild(document.createTextNode("Sample Content"));

    $('#' + divIdToBeUsed).append(hh);

}

var spanElement = function(compInfo){
    var spanElement = document.createElement("span");
    updateCommonAttribute(spanElement, compInfo);
    if(compInfo.innerText)
        spanElement.innerText = compInfo.innerText;
    return spanElement;
};

var LablesWithCloseIconListComp = function () {
    var div = document.createElement("div");
    $(div).attr({class : "form-control borderColorForDiv"});
    $(div).css({
        "flex-flow": "row wrap",
        "height": "66px",
        "overflow-y": "auto",
        "border-radius": "4px"
    });
    this.getDiv = function () {
        return div;
    }
    this.addLabel = function (input) {
        if(Array.isArray(input.labels))
        {
            for (var i = 0; i < input.labels.length ; i++) {
                var elementToAppend = new labelWithCloseIcon({labels : input.labels[i],closeBtnAction : input.closeBtnAction});
                $(div).append(elementToAppend);
            }
            return;

        }
        if(typeof input.labels == "string" || typeof input.labels == "object")
        {
            var elementToAppend = new labelWithCloseIcon({labels : input.labels, closeBtnAction : input.closeBtnAction});
            $(div).append(elementToAppend);
            return;
        }
    }
};

var reorderListComp = function (inputParams) {
    var divContent = document.createElement("div");
    $(divContent).attr("class", "col-sm-12");
    $(divContent).css("margin-bottom", "15px");

    var listCompPanel = _listCompPanel();
    var optionsPanel = _optionsPanel();

    $(divContent).append(listCompPanel);
    $(divContent).append(optionsPanel);

    this.getDivContent = function () {
        return divContent;
    };

    this.getOrderedItems = function () {
        var orderedItems = [];
        $(listCompPanel).find('li').each(function () {
            orderedItems.push(JSON.parse($(this).attr("value")));
        });
        return orderedItems;
    };

    function _optionsPanel() {
        var optionsPanel = document.createElement("div");
        $(optionsPanel).attr("class", "col-sm-2");

        var moveUpBtn = _createMoveUpBtn();
        var moveDownBtn = _createMoveDownBtn();
        var removeElmtBtn = _createRemoveEltBtn();

        $(optionsPanel).append(moveUpBtn);
        $(optionsPanel).append(moveDownBtn);
        $(optionsPanel).append(removeElmtBtn);

        function _createMoveUpBtn() {
            var moveUpBtn = new ButtonComponent("moveupbtn", "", 'margin-bottom:5px');
            var upArrowSpan = new spanElement({class: "glyphicon glyphicon-arrow-up"});
            $(moveUpBtn).append(upArrowSpan);
            moveUpBtn.onclick = function () {
                var sourceElement = $(listCompPanel).find('.selectedLabel');
                _moveUp(sourceElement);
            };
            return moveUpBtn;
        }

        function _createMoveDownBtn() {
            var moveDownBtn = new ButtonComponent("movedownbtn", "", 'margin-bottom:5px');
            var downArrowSpan = new spanElement({class: "glyphicon glyphicon-arrow-down"});
            $(moveDownBtn).append(downArrowSpan);
            moveDownBtn.onclick = function () {
                var sourceElement = $(listCompPanel).find('.selectedLabel');
                _moveDown(sourceElement);
            };
            return moveDownBtn;
        }

        function _createRemoveEltBtn() {
            var removeElmtBtn = new ButtonComponent("removebtn", "", '');
            var minusSpan = new spanElement({class: "glyphicon glyphicon-minus"});
            $(removeElmtBtn).append(minusSpan);
            removeElmtBtn.onclick = function () {
                var currentElement = $(listCompPanel).find('.selectedLabel');
                _removeElt(currentElement);
            };
            return removeElmtBtn;
        }

        function _moveUp(sourceElement) {
            var prevElement = $(sourceElement).prev('.liElementsGrp');

            if (prevElement.length != 1) {
                return;
            }

            var elementToMove = sourceElement.detach();
            prevElement.before(elementToMove);
            var elementPosition = $(elementToMove).position().top;
            $(listCompPanel).scrollTop(elementPosition);

        }

        function _moveDown(sourceElement) {
            var nextElement = $(sourceElement).next('.liElementsGrp');

            if (nextElement.length != 1) {
                return;
            }

            var elementToMove = sourceElement.detach();
            nextElement.after(elementToMove);
            var elementPosition = $(elementToMove).position().top;
            $(listCompPanel).scrollTop(elementPosition);

        }

        function _removeElt(srcElement) {
            $(srcElement).remove();
        }

        return optionsPanel;
    }

    function _listCompPanel() {
        var listCompPanel = new ListComponent(inputParams.list);
        $(listCompPanel).attr("class", "col-sm-10");
        $(listCompPanel).css({
            "height": "200px",
            "overflow": "auto",
            "box-shadow": "6px 3px 8px #d4d4d4"
        });
        return listCompPanel;
    }
};

var ListComponent = function (list) {

    var listComp = document.createElement("div");
    var ulElement = document.createElement("ul");
    $(ulElement).css("padding-inline-start", "0px");

    for (var i = 0; i < list.length ; i++) {

        var liElement = document.createElement("li");
        $(liElement).attr({ class : "liElementsGrp"});
        $(liElement).css("list-style-type", "none");

        if(typeof list[i] == "object"){
            $(liElement).text(list[i].label);
            $(liElement).attr("value", JSON.stringify(list[i]));
        }

        if(typeof list[i] == "string"){
            $(liElement).text(list[i]);
            $(liElement).attr("value", list[i]);
        }


        liElement.onclick = function() {
            $('.selectedLabel').removeClass('selectedLabel');
            $(this).addClass('selectedLabel');
        };
        $(ulElement).append(liElement);
    }
    $(listComp).append(ulElement);

    return listComp;
};

$('html,body').on('click', function (e) {
    $('[data-toggle=popover]').each(function () {
        if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
            $(this).popover('destroy');
        }
    });
});

var showReorderedListCompInPopOver = function (inputParams) {
    var sourceElement = inputParams.sourceElement;
    var divContent = new reorderListComp({ list : inputParams.list});
    var okButton =_createOkButton;
    var popOverContent = document.createElement("div");
    $(popOverContent).append(divContent.getDivContent());
    $(popOverContent).append("<br>");
    $(popOverContent).append(okButton);
    $(popOverContent).append("<br>");
    $(sourceElement).popover({
        container: 'body',
        trigger : "manual",
        title : inputParams.header,
        placement : "auto",
        html : true,
        content : popOverContent
    });
    $(sourceElement).popover('toggle');

    function _createOkButton()
    {
        var okButton = new ButtonComponent("OK", "OK", 'margin-bottom:7px');
        $(okButton).addClass("pull-right");
        okButton.onclick = function () {
            var orderedItems = divContent.getOrderedItems();
            inputParams.okButtonImpl(orderedItems);
            $(sourceElement).popover('destroy');
        };
        return okButton;
    }
};

var ChosenBox = function(id,items,defaultValue, options) {

    let select = document.createElement("select");

    if (id)
        $(select).attr("id", id);

    if(options) {
        if (!options.showFirstOptionByDefault) {
            let emptyOption = document.createElement("option");
            $(select).append(emptyOption);
        }
    }

    if(items != null)
    {
        for (let i = 0; i < items.length; i++) {
            let item = items[i];

            if(item.name || item.label) {
                if (item.name == null && item.label == null)
                    continue;
            }

            let option = _getOption(item);
            $(select).append(option);
        }
    }

    function _getOption(obj) {
        let option = document.createElement("option");

        let id = _getOptionId(obj);
        let text = _getOptionText(obj);

        $(option).attr('value', id);
        option.text = text;
        return option;
    }

    function _getOptionId(obj) {
        if (obj.id)
            return obj.id;
        else if (obj.label)
            return obj.label;

        return obj;
    }

    function _getOptionText(obj) {
        if (obj.label)
            return obj.label;

        return obj;
    }

    if (defaultValue)
        $(select).val(defaultValue);

    return select;
}

var ToggleButton = function(id, name, value, label)
{
        let e_label = document.createElement("label");
        e_label.classList.add("switch");
        e_label.classList.add("switch-xs");
        e_label.classList.add("cygnetToggle");

        let e_input = document.createElement("input");
        e_input.setAttribute("id", id);
        e_input.setAttribute("name", name);
        e_input.setAttribute("value", value);
        e_input.setAttribute("type","checkbox");
        e_label.appendChild(e_input);

        let i = document.createElement("i");
        e_label.appendChild(i);

        if (label)
        {
            let textNode = document.createTextNode(label);
            let span = document.createElement("span");
            span.style.paddingLeft = "5px";
            span.appendChild(textNode);
            e_label.appendChild(span);
        }

        return e_label;
}

function createAndLoadPanel(panelId, header, contentDiv, panelHeight) {

    let panel = createDivElement({id:panelId, class: "cygnet-panel"});

    let panelHeader = createDivElement({class:"panel-heading headingAlignment"});
    panelHeader.textContent = header;
    panel.append(panelHeader);

    let panelBody = createDivElement({class :"panel-body"});
    panel.append(panelBody);

    if(contentDiv)
        panelBody.append(contentDiv);

    return panel;
}

var IconGroup = function (parentDom, iconInfos, iconClasses)
{
    iconInfos.forEach((iconInfo) => {
        let span = document.createElement('span');
        $(parentDom).append(span);

        let i = document.createElement("i");
        $(span).append(i);
        $(i).addClass(iconInfo.iconName);
        $(i).addClass("iconButton-without-border");
        if(iconClasses)
            $(i).addClass(iconClasses);
        if (iconInfo.id)
            $(i).attr("id", iconInfo.id);
        if (iconInfo.toolTipText)
        {
            $(i).attr("data-toggle", "tool-tip");
            $(i).attr("title", iconInfo.toolTipText);
        }
    });
}

var getSelectBox = function (items, id, defaultValue) {
    let select = document.createElement("select");

    if (id)
        $(select).attr("id", id);

    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        let option = _getOption(item);
        $(select).append(option);
    }

    function _getOption(obj) {
        let option = document.createElement("option");

        let id = _getOptionId(obj);
        let text = _getOptionText(obj);

        $(option).attr('value', id);
        option.text = text;
        return option;
    }

    function _getOptionId(obj) {
        if (obj.id)
            return obj.id;
        else if (obj.label)
            return obj.label;

        return obj;
    }

    function _getOptionText(obj) {
        if (obj.label)
            return obj.label;

        return obj;
    }

    if (defaultValue)
        $(select).val(defaultValue);

    return select;
}

function buildCenterAlignedImageDiv(panelHeader, imgInfo) {
    let imageDiv = createDivElement({id:"imageDiv", style: "display: flex; flex-flow: column;align-items: center; justify-content: center; height: 240px;"});
    let img = document.createElement('img');
    img.src = imgInfo.src;
    if(imgInfo.height)
        $(img).css("height", imgInfo.height);
    if(imgInfo.width)
        $(img).css("width", imgInfo.width);
    imageDiv.appendChild(img);

    if (panelHeader) {
        let imageLabel = createDivElement({id: "imageLabel"});
        imageLabel.innerHTML = getSpanLabel(panelHeader + " not available");
        imageDiv.appendChild(imageLabel);
    }
    return imageDiv;
}

function getSpanLabel(label) {
    return '<span style = "font-weight: bolder; font-size:14px">' + label + '</span>';
}

function getTextAreaWithLimit(input, maxLength, visibleRows) {
    let inputDiv = document.createElement("div");
    inputDiv.append(input);
    input.placeholder = "Please write your comments here";
    input.style.resize = 'none';
    input.setAttribute("style", "width: 100%;");
    input.setAttribute("class", "form-control");

    if (visibleRows)
        input.rows = visibleRows;
    if (maxLength) {
        input.maxLength = maxLength;
        let textLimitDiv = document.createElement("div");
        textLimitDiv.setAttribute("style", "display: flex;justify-content: flex-end;font-size: 11px;margin-top: 5px;color: #626262;font-style: italic;user-select: none;");
        let title = Number(maxLength) + " Characters allowed" ;
        textLimitDiv.setAttribute("title", title);
        textLimitDiv.innerHTML = "0/" + input.maxLength;

        input.addEventListener('input', function (e) {
            const target = e.target;
            const currentLength = target.value.length;
            const maxLength = target.getAttribute('maxlength');
            textLimitDiv.innerHTML = currentLength + "/" + maxLength;
            if (currentLength === Number(maxLength))
                $(target).addClass('limitEnd');
            else
                if ($(target).hasClass('limitEnd'))
                    $(target).removeClass('limitEnd');
        });

        inputDiv.append(textLimitDiv);
    }
    return inputDiv;

}
function _createRadioButtons(buttons) {

    let inputDiv = createDivElement({id:"criteriaAndOrDiv",class:"criteriaAndOrDiv criteriaRadioDiv"});
    inputDiv.setAttribute("style",buttons.styleAttr);
    let btnInfo = buttons.buttonsInfo;

    for (let btn in btnInfo) {
        let btnLabel = document.createElement("label");
        if(buttons.title)
            btnLabel.setAttribute("title",buttons.title);
        let btnInput = document.createElement("input");
        btnInput.setAttribute("name", buttons.groupName);
        btnInput.setAttribute("value", btnInfo[btn]['name']);
        btnInput.setAttribute("type", "radio");
        btnInput.setAttribute("style", "float: left; padding: 2px 0 0 2px;");
        if(btnInfo[btn]['checked'])
            btnInput.setAttribute("checked",btnInfo[btn]['checked']);
        btnLabel.appendChild(btnInput);

        $(btnInput).on('change', function () {
            window[buttons['onChange']](this);
        });

        let textSpan = document.createElement("span");
        let textNode = document.createTextNode(btnInfo[btn]['label']);
        textSpan.appendChild(textNode);
        $(textSpan).css('float', 'left');
        $(textSpan).css('padding', '1.5px 1em 0px 8px');
        $(textSpan).css('font-weight', '400!important');
        $(textSpan).css('font-size', "10px");

        btnLabel.appendChild(textSpan);

        inputDiv.appendChild(btnLabel);
    }

    return inputDiv;
}

function _getStartOrEndDateDiv(givenDate_Id, givenCalSpan_Id, label, startDate )
{
    let givenDateLabel_Id = givenDate_Id+"Label" ;
    let dateLabelComp;
    let date = new Date();
    if(label === "Start Date") {
        switch (startDate){
            case "One day":
                date.setDate(date.getDate()-2);
                break;
            case "One month":
                const month = date.getMonth();
                date.setMonth(month - 1);
                break;
        }
        dateLabelComp = _getLabelComp(givenDateLabel_Id, label, null, "20px");
    }
    else if(label === "End Date"){
        dateLabelComp = _getLabelComp(givenDateLabel_Id, label, "20px", "20px");
    }
    let givenDateDiv = createDivElement({id:givenDate_Id+'Div', class:'form-group'});
    let givenDate = new DateComp(givenDate_Id, date);

    givenDateDiv.appendChild(dateLabelComp);
    givenDateDiv.appendChild(givenDate);

    return givenDateDiv;
}

function _getLabelComp(label_Id, label_Text, leftPx, rightPx)
{
    let labelInput = {
        id : label_Id,
        innerText : label_Text,
    };
    let label = new LabelComponent(labelInput);
    label.style.marginLeft = leftPx;
    label.style.marginRight = rightPx;
    return label;
}

/* Method to check whether the string contains special character for xss attack*/
function checkForXSSAttack(input) {
    const htmlTagRegex = /<[^>]*>/;
    return htmlTagRegex.test(input);
}

function _createCustomRadioButtons(buttons) {

    let inputDiv = createDivElement({id:"customRadioButton",class:"customRadioButton"});
    inputDiv.setAttribute("style",buttons.styleAttr);
    let btnInfo = buttons.buttonsInfo;

    for (let btn in btnInfo) {
        let btnLabel = document.createElement("label");
        btnLabel.setAttribute("class","checkTickMark");
        if(buttons.title)
            btnLabel.setAttribute("title",buttons.title);
        let btnInput = document.createElement("input");
        btnInput.setAttribute("name", buttons.groupName);
        btnInput.setAttribute("value", btnInfo[btn]['name']);
        btnInput.setAttribute("type", "radio");
        btnInput.setAttribute("style", "display:none;");
        if(btnInfo[btn]['checked']) {
            btnInput.setAttribute("checked", btnInfo[btn]['checked']);
        }
        btnLabel.appendChild(btnInput);

        $(btnInput).on('click', function () {
            if(buttons['onChange'])
                window[buttons['onChange']](this,buttons['props'],buttons['buttonProps']);
        });

        let textSpan = document.createElement("span");

        if(btnInfo[btn]['label']) {
            let textNode = document.createTextNode(btnInfo[btn]['label']);
            textSpan.appendChild(textNode);
        }

        if(btnInfo[btn]['title']) {
           textSpan.setAttribute("title",btnInfo[btn]['title']);
        }
        textSpan.setAttribute("style","float: left;padding: 5px 15px 5px 20px; font-weight: 400 !important; margin-left: 8px; border-radius: 4px; font-size: 12px;")

        if(buttons.textSpanStyle){
            textSpan.setAttribute("style",buttons['textSpanStyle']);
        }
        btnLabel.appendChild(textSpan);

        inputDiv.appendChild(btnLabel);

        if(btnInfo[btn]['className']) {
            textSpan.setAttribute("class", btnInfo[btn]['className']);
        }
    }

    return inputDiv;
}

var ToggleButtonWithOnChange = function(id, name, value, label,title,onChangeMethod) {
    let e_label = document.createElement("label");
    e_label.classList.add("switch");
    e_label.classList.add("switch-xs");
    e_label.classList.add("cygnetToggle");
    e_label.setAttribute("title",title);

    if (label)
    {
        let textNode = document.createTextNode(label);
        let labelDiv = document.createElement("div");
        labelDiv.appendChild(textNode);
        e_label.appendChild(labelDiv);
    }

    let e_input = document.createElement("input");
    e_input.setAttribute("id", id);
    e_input.setAttribute("name", name);
    e_input.setAttribute("value", value);
    e_input.setAttribute("type","checkbox");
    e_label.appendChild(e_input);

    let i = document.createElement("i");
    e_label.appendChild(i);

    $(e_input).on("click", function() {
        if (onChangeMethod) {
            onChangeMethod(this,e_input.checked); // Call the onChangeMethod with the current checked state
        }
    });
    return e_label;
};

var ToggleButtonWithText = function(id, name, value, label,title,onChangeMethod) {
    // Create the main label element
    let e_div =document.createElement("div");

    if (label) {
        let textNode = document.createTextNode(label);
        let labelDiv = document.createElement("div");
        labelDiv.appendChild(textNode);
        e_div.appendChild(labelDiv);
    }

    let e_label = document.createElement("label");
    e_div.appendChild(e_label);
    e_label.className = "toggleSwitch";
    e_label.setAttribute("title",title);

    // Create the input element
    let e_input = document.createElement("input");
    e_input.setAttribute("id", id);
    e_input.setAttribute("name", name);
    e_input.setAttribute("value", value);
    e_input.setAttribute("type", "checkbox");
    e_label.appendChild(e_input);


    // Create the slider span
    let slider = document.createElement("span");
    slider.className = "toggleSlider toggleRound";
    e_label.appendChild(slider);

    // Create text elements inside the slider

    let onText = document.createElement("span");
    onText.className = "on";
    onText.textContent = "ON";
    slider.appendChild(onText);

    let offText = document.createElement("span");
    offText.className = "off";
    offText.textContent = "OFF";
    slider.appendChild(offText);

    $(e_input).on("click", function() {
        if (onChangeMethod) {
            onChangeMethod(this,e_input.checked); // Call the onChangeMethod with the current checked state
        }
    });
    return e_div;
}

function loadOnTypeSearchComboComp(id, url, isMultiple, placeHolder,additionalProps,width,onChangeFunction) {
    $("#" + id).select2({
        multiple: isMultiple,
        placeholder: placeHolder,
        allowClear: true,
        width: width,
        ajax: {
            url: url,
            dataType: 'json',
            delay: 250,
            data: function (params) {
                let inputMap = { searchKey: params }; // Use params.term for the search term

                if (additionalProps) {
                    for (let prop in additionalProps) {
                        if (prop === "inputMap" && typeof additionalProps[prop] === 'object') {
                            // If 'input' is an object, add its key-value pairs to inputMap
                            for (let key in additionalProps[prop]) {
                                if (additionalProps[prop].hasOwnProperty(key)) {
                                    inputMap[key] = additionalProps[prop][key];
                                }
                            }
                        }
                    }
                    return {
                        url: additionalProps.url,
                        inputMap : JSON.stringify(inputMap),
                        configName : additionalProps.configName,
                        method : additionalProps.method
                    }
                }
                else {
                    return {
                        neSearchInput: params, // search term
                    };
                }
            },
            results: function (data, params) {
                var idTextList = [];
                $.each(data, function (index, neIDText) {
                    idTextList.push({id: neIDText.name, objectId:neIDText.id, text: neIDText.label, title: neIDText.label});
                });
                return {results: idTextList};
            },
            cache: true,
        },
        formatSearching: 'Searching...',
        formatAjaxError: function (jqXHR, respose, error) {
            if (jqXHR.responseText != null && typeof (jqXHR.responseText) == 'string' && jqXHR.responseText.indexOf("Login") > -1) {
            }
            return 'Loading failed';
        },
        escapeMarkup: function (markup) {
            return markup;
        },
        minimumInputLength: 2,
        formatResult: function (item) {
            var title = item.title;
            return "<div title ='" + title + "'>" + title + "</div>"
        }
    }).on('change', onChangeFunction);
}