package devapp.upt;

import org.junit.jupiter.api.Test;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.security.NoSuchAlgorithmException;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class EduUserHashPasswordExceptionTest {

    @Test
    void hashPasswordShouldWrapException() throws Exception {

        Method m = Edu_User.class.getDeclaredMethod("hashPassword", String.class);
        m.setAccessible(true);

        // 1. Reflection ALWAYS throws InvocationTargetException
        InvocationTargetException ex = assertThrows(
                InvocationTargetException.class,
                () -> m.invoke(null, "FORCE_ERROR")
        );

        // 2. Extract "real" exception from inside
        Throwable cause = ex.getCause();

        assertTrue(
                cause instanceof IllegalStateException,
                "The method should wrap exceptions into IllegalStateException"
        );

        // 3. Check underlying root cause
        assertTrue(
                cause.getCause() instanceof NoSuchAlgorithmException,
                "IllegalStateException should wrap NoSuchAlgorithmException"
        );
    }
}