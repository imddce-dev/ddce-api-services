import Swal from 'sweetalert2';
import type { SweetAlertOptions } from 'sweetalert2';

/* ✅ Success Alert */
export const CustomAlertSuccess = async (
  title: string,
  text: string,
  options?: SweetAlertOptions
) => {
  const result = await Swal.fire({
    title,
    text,
    icon: 'success',
    confirmButtonText: 'รับทราบ',
    allowOutsideClick: () => false,
    allowEscapeKey: false,
    allowEnterKey: false,
    customClass: {
      popup: 'my-swal-popup success',   // ✅ success style
      title: 'my-swal-title',
      confirmButton: 'my-swal-confirm-button-success',
    },
    ...options,
  });
  return result;
};

/* ⚠️ Warning Alert */
export const CustomAlertWarning = async (
  title: string,
  text: string,
  options?: SweetAlertOptions
) => {
  const result = await Swal.fire({
    title,
    text,
    icon: 'warning',
    confirmButtonText: 'รับทราบ',
    allowOutsideClick: () => false,
    allowEscapeKey: false,
    allowEnterKey: false,
    customClass: {
      popup: 'my-swal-popup warning',   // ⚠️ warning style
      title: 'my-swal-title',
      confirmButton: 'my-swal-confirm-button-warning',
      cancelButton: 'my-swal-cancel-button',
    },
    ...options,
  });
  return result;
};

/* ❌ Error Alert */
export const CustomAlertError = async (
  title: string,
  text: string,
  options?: SweetAlertOptions
) => {
  const result = await Swal.fire({
    title,
    html: `
      <div class="animated-icon-wrapper">
        <img src="/eror.png" alt="Error" class="animated-icon" />
      </div>
      <p>${text}</p>
    `,
    showConfirmButton: true,
    confirmButtonText: 'รับทราบ',
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,
    customClass: {
      popup: 'my-swal-popup error',
      title: 'my-swal-title',
      confirmButton: 'my-swal-confirm-button-error',
      htmlContainer: 'my-swal-html',
    },
    ...options,
  });
  return result;
};

