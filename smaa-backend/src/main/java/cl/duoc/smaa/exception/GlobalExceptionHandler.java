package cl.duoc.smaa.exception;

import cl.duoc.smaa.dto.ErrorResponse;
import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest request) {
        Map<String, String> validations = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> validations.put(error.getField(), error.getDefaultMessage()));
        return build(HttpStatus.BAD_REQUEST, "Datos de entrada inválidos", request.getRequestURI(), validations);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleJson(HttpMessageNotReadableException ex, HttpServletRequest request) {
        String msg = "JSON inválido o formato de fecha/hora incorrecto. Usa fechas como yyyy-MM-dd.";
        if (ex.getCause() instanceof InvalidFormatException) {
            msg = "Formato de dato inválido. Revisa fechas, enums y números.";
        }
        return build(HttpStatus.BAD_REQUEST, msg, request.getRequestURI(), Map.of("body", msg));
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex, HttpServletRequest request) {
        return build(HttpStatus.NOT_FOUND, ex.getMessage(), request.getRequestURI(), null);
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusiness(BusinessException ex, HttpServletRequest request) {
        return build(HttpStatus.BAD_REQUEST, ex.getMessage(), request.getRequestURI(), null);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneral(Exception ex, HttpServletRequest request) {
        return build(HttpStatus.INTERNAL_SERVER_ERROR, "Error interno del microservicio: " + ex.getMessage(), request.getRequestURI(), null);
    }

    private ResponseEntity<ErrorResponse> build(HttpStatus status, String message, String path, Map<String, String> validations) {
        ErrorResponse response = new ErrorResponse(
                LocalDateTime.now(),
                status.value(),
                status.getReasonPhrase(),
                message,
                path,
                validations
        );
        return ResponseEntity.status(status).body(response);
    }
}
