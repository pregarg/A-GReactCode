import React from "react";

export default function CallModal(props) {
  const [dataIndex, setDataIndex] = useState();

  const [modalShow, setModalShow] = useState(false);

  const decreaseDataIndex = () => {
    const indx = dataIndex - 1;
    setDataIndex(indx);
  };

  const handleModalChange = (flag) => {
    setModalShow(flag);
  };

  const handleDataIndex = (index) => {
    console.log("Inside setDataIndex: ", index);
    setDataIndex(index);
  };
  return (
    <>
      <GridModal
        modalShow={modalShow}
        handleModalChange={handleModalChange}
        dataIndex={props.dataIndex}
        tdDataReplica={props.tdDataReplica}
        deleteTableRows={props.deleteTableRows}
        gridName={props.gridName}
        decreaseDataIndex={decreaseDataIndex}
      ></GridModal>
    </>
  );
}
