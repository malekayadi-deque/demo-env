const CallToAction = ({href, label}) => {
    return (
        <button className="btn-link btn-link_sm default-underline text-uppercase fw-medium animate animate_fade animate_btt animate_delay-7">
            <a href={href}>
                {label}
            </a>
        </button>
    );
}

export default CallToAction;