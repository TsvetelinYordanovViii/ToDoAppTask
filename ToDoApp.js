let largestIndex = 1;

addItem = (givenIndex, value) => {
    if (value.trim() != "") {
        //Initializing variables.
        let itemIndex = largestIndex;
        let itemClass = "item" + itemIndex;
        let paragraph = $("<p></p>");
        let newItem = $("<li></li>");
        let content = $("<div></div>");
        let options = $("<div></div>");

        //For the edit and delete button, I decided it will be better if I just inject the code directly here.
        let editButton = $(`
        <button class="btn border  me-2 edit">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                <path
                d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                <path fill-rule="evenodd"
                d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
            </svg>
        </button>`
        );

        let deleteButton = $(`
        <button class="btn border  me-2 delete">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                fill="currentColor" class="bi bi-trash2" viewBox="0 0 16 16">
                <path
                d="M14 3a.702.702 0 0 1-.037.225l-1.684 10.104A2 2 0 0 1 10.305 15H5.694a2 2 0 0 1-1.973-1.671L2.037 3.225A.703.703 0 0 1 2 3c0-1.105 2.686-2 6-2s6 .895 6 2zM3.215 4.207l1.493 8.957a1 1 0 0 0 .986.836h4.612a1 1 0 0 0 .986-.836l1.493-8.957C11.69 4.689 9.954 5 8 5c-1.954 0-3.69-.311-4.785-.793z" />
            </svg>
        </button>`
        );

        //Adding the classes of all the elements in the To Do item.
        content.addClass("col-8 d-flex align-items-center ms-1");
        paragraph.addClass("align-items-center m-0");
        //The value of the To Do item is also added here.
        value = value.trim()
        paragraph.text(value);
        options.addClass("col-2 d-flex align-items-center justify-content-end visually-hidden taskOptions");

        newItem.addClass("ms-2 list-group-item d-flex flex-row justify-content-between");

        //Check for an unused item id after existing items.
        //Some dot shenanigans are at play here because for adding a class the dot is not required while for selecting by class it is.
        if (givenIndex == -1) {
            while ($("." + itemClass).length > 0) {
                itemIndex++;
                itemClass = "item" + itemIndex;
            };
        }
        else {
            itemClass = givenIndex;
        }
        newItem.addClass(itemClass);

        //Assembling the completed To Do item.
        content.append(paragraph);
        options.append(editButton, deleteButton);
        newItem.append(content, options);
        //Adding event listeners for hovering over the item. It is about hiding and revealing the option buttons.
        //I can't use the toggle class method because the save or cancel function doesn't accordingly change the visibility 
        //of the options box. If set to toggle, then cancelling or saving the editing of an item will cause the options box.
        //to be hidden when the mouse hovers over it and be visible when the cursor is outside the task.
        $(newItem).hover(() => {
            $("." + itemClass + " .taskOptions").removeClass("visually-hidden");
        }, () => {
            $("." + itemClass + " .taskOptions").addClass("visually-hidden");
        });

        editButton.click(() => { editItem(itemClass) });
        deleteButton.click(() => { deleteItem(itemClass) });

        //The function must not save the items again when it loads them from local storage.
        //-1 is given only when adding new items via tha add button.
        if (givenIndex == -1)
            localStorage.setItem(itemClass, value);

        $("#toDoList").append(newItem);
    }
    else {
        alert("You haven't written anything.");
    }
}

deleteItem = (item) => {
    localStorage.removeItem(item);
    $("." + item).remove();
}

editItem = (itemClass) => {
    //Creating the needed buttons for saving and cancelling the edit.
    let saveButton = $(`
    <button class="btn border me-2 save">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
            class="bi bi-check2" viewBox="0 0 16 16">
            <path
                d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
        </svg>
    </button>`
    );

    let cancelButton = $(`
    <button class="btn border me-2 cancel">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
            class="bi bi-x-lg" viewBox="0 0 16 16">
            <path
                d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
        </svg>
    </button>`
    );
    let editedItem = $("." + itemClass + " div:first");
    let taskText = $("." + itemClass + " div:first p");
    let itemOptions = $("." + itemClass + " div:nth-child(2)");

    //Creating an input containing the content from the paragraph in the element.
    editingField = $("<input/>")
    editingField.addClass("col-8 d-flex align-items-center");
    editingField.val(taskText.text());

    saveButton.click(() => { saveOrCancelEdit(itemClass, false) });
    cancelButton.click(() => { saveOrCancelEdit(itemClass, true) });

    $("." + itemClass + " div:nth-child(2) .edit").addClass("visually-hidden");
    itemOptions.prepend(cancelButton);
    itemOptions.prepend(saveButton);
    editedItem.addClass("editing visually-hidden");
    $("." + itemClass).prepend(editingField);
}

saveOrCancelEdit = (itemClass, cancel) => {
    let editedItem = $("." + itemClass + " div:first");
    let taskText = $("." + itemClass + " div:first p");
    let editingField = $("." + itemClass + " input");

    $("." + itemClass + " div:nth-child(3) .save").remove();
    $("." + itemClass + " div:nth-child(3) .cancel").remove();
    $("." + itemClass + " div:nth-child(3) .edit").removeClass("visually-hidden");

    if (!cancel && editingField.val().trim() != "") {
        let value = editingField.val().trim()
        taskText.text(value);
        localStorage.setItem(itemClass, value);
    }
    editingField.remove();
    editedItem.removeClass("editing visually-hidden");
}

$(document).ready(() => {
    $("#add").click(() => {
        addItem(-1, $("#toDoField").val());
        $("#toDoField").val("");
    })

    //Number of list items.
    //I just hoped the .length will work as intended. It did.
    let tasksIndexes = [];
    for (let i = 0; i < localStorage.length; i++) {
        tasksIndexes[i] = localStorage.key(i);
    }
    //The keys are unordered, thus requiring this extra step of adding an array with the keys and sort them.
    tasksIndexes = tasksIndexes.sort();

    //After that, add the items to the to do list.
    for (let i = 0; i < tasksIndexes.length; i++) {
        let key = tasksIndexes[i];
        let itemIndex = "item" + (i + 1);
        let value = localStorage.getItem(key);

        addItem(itemIndex, value);
        //When the user deletes any items from the to do list, aside from the last one, it causes the items
        //to be disorganized and when reloading the page the tasks may be in different positions.
        if (itemIndex !== key) {
            localStorage.setItem(itemIndex, value);
            localStorage.removeItem(key);
        }
    }

    //Removing upper items and adding new ones will cause the newer items to appear in their position
    //when reloading the page. By finding the largest index and using it as the initial value of
    //itemIndex in addItem we ensure that the new items will remain after existing ones upon reload.
    largestIndex = tasksIndexes.length + 1;
});