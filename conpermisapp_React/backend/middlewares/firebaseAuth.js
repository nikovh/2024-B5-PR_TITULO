async function firebaseAuthMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send('No se proporcionó Token');
    }

    const token = authHeader.split(' ')[1];
    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        // decodedToken.uid es el UID de firebase
        req.user = decodedToken;
        next();
    } catch (error) {
        return  res.status(401).send('Token invalido');
    }
}