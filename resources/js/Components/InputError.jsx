export default function InputError({ message, className = '', ...props }) {
    return message ? (
        <p {...props} className={'tracking-thighter mt-2 text-sm text-red-600 ' + className}>
            {message}
        </p>
    ) : null;
}
