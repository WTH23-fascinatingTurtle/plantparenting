export default (req, res) => {
    const { name, value } = req.query; // Get the value from the query parameters

    if (!value || !name) {
        return res.status(400).json({ error: 'Cookie Name or Value is missing in query parameters' });
    }

    // Set the cookie with the provided value
    res.setHeader('Set-Cookie', `${name}=${value}; Path=/; HttpOnly`);
    res.status(200).json({ message: 'Cookie set successfully' });
};