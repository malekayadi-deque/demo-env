const ActionBtn = ({
    title,
    className="pc__atc btn anim_appear-bottom btn position-absolute border-0 text-uppercase fw-medium js-add-cart js-open-aside",
    onClick=()=>{},
    children,
}) => {
    return (
        <div
            className={className}
            onClick={onClick}
            title={title}
        >
            {children}
        </div>
    );
}

export default ActionBtn;