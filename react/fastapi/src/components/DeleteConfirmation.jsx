
// import React, { useRef } from 'react';
// import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
// import { Toast } from 'primereact/toast';
// import { Button } from 'primereact/button';

// export default function DeleteConfirmation() {
//     const toast = useRef(null);

//     const accept = () => {
//         toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
//         return 'Confirm'
//     }

//     const reject = () => {
//         toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
//         return "Reject"
//     }

//     const confirm1 = () => {
//         confirmDialog({
//             message: 'Are you sure you want to proceed?',
//             header: 'Confirmation',
//             icon: 'pi pi-exclamation-triangle',
//             defaultFocus: 'accept',
//             accept,
//             reject
//         });
//     };

//     const confirm2 = () => {
//         confirmDialog({
//             message: 'Do you want to delete this record?',
//             header: 'Delete Confirmation',
//             icon: 'pi pi-info-circle',
//             defaultFocus: 'reject',
//             acceptClassName: 'p-button-danger',
//             accept,
//             reject
//         });
//     };

//     return (
//         <>
//             <Toast ref={toast} />
//             <ConfirmDialog />
//             <div className="card flex flex-wrap gap-2 justify-content-center">
//                 <Button onClick={confirm1} icon="pi pi-check" label="Confirm" className="mr-2"></Button>
//                 <Button onClick={confirm2} icon="pi pi-times" label="Delete"></Button>
//             </div>
//         </>
//     )
// }
        


import React, { useRef } from 'react';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';

export default function DeleteConfirmation({ onDelete }) {
    const toast = useRef(null);

    const accept = () => {
        toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
        onDelete();  // Call the delete function passed from parent
    }

    const reject = () => {
        toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
    }

    const confirmDelete = (message, header) => {
        confirmDialog({
            message: message,
            header: header,
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            accept,
            reject
        });
    };

    return (
        <>
            <Toast ref={toast} />
            <ConfirmDialog />
            {/* Empty div for triggering the confirmation dialog */}
            <div onClick={() => confirmDelete("Are you sure you want to delete this user?", "Delete Confirmation")}></div>
        </>
    )
}
