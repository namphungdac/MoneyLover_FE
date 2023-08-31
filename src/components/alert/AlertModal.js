import Swal from 'sweetalert2';
export const showSuccessAlert = async (APIData) => {
    await Swal.fire({
        position: 'center',
        showConfirmButton: false,
        timerProgressBar: true,
    })
    if (APIData) {
        Swal.fire({
            icon: 'success',
            title: 'Login Success',
            showConfirmButton: false,
            timer: 1500
        })
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Login Fails',
            showConfirmButton: false,
            timer: 1500
        })
    }
}