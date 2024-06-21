import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const useSwalWrapper = () => {
  const FinalSwal = Swal.mixin({
    toast: true,
    buttonsStyling: false,
    showConfirmButton: false,
    timer: 5000,
    position: "top-end",
  });

  return withReactContent(FinalSwal);
};

export default useSwalWrapper;
