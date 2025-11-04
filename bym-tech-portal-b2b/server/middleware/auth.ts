import jwt from 'jsonwebtoken'


const PROTECTED_ROUTES = ['/api/controller/productRating']

export default defineEventHandler(async (event) => {

  const path = getRequestURL(event).pathname
  // Verifica si la ruta actual comienza con alguna de las rutas protegidas
  const isProtectedRoute = PROTECTED_ROUTES.some(route => path.startsWith(route))
  if (!isProtectedRoute) {
    return
  }
  const token = getHeader(event, 'Authorization')?.replace('Bearer ', '');

  // Si no hay token, devuelve un error
  if (!token) {
    return createError({
      statusCode: 401,
      statusMessage: 'Token missing',
    });
  }

  try {
    const isValid = await verifyToken(token);

    if (!isValid) {
      return createError({
        statusCode: 401,
        statusMessage: 'Invalid token',
      });
    } else {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Guardar en el contexto
      event.context.auth = {
        userId: decoded.userId
      }
    }

  } catch (error) {
    console.log(error)
    return createError({
      statusCode: 500,
      statusMessage: 'Server error during token verification',
    });
  }
});

// Función ficticia que representa la verificación del token
async function verifyToken(token: string) {
  const secret = process.env.JWT_SECRET;
  try {
    return await jwt.verify(token, secret);
  } catch (error) {
    throw throwError('Token validation failed', codeError.BYMTECH003.code, 401, lang, 'Invalid or expired token');
  }
};
