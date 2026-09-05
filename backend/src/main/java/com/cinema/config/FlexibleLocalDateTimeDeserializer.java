package com.cinema.config;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;

// [AI UPDATE - Bo giai ma Jackson ho tro linh hoat ca chuoi yyyy-MM-dd va yyyy-MM-ddTHH:mm:ss]
public class FlexibleLocalDateTimeDeserializer extends JsonDeserializer<LocalDateTime> {

    @Override
    public LocalDateTime deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        String text = p.getText();
        if (text == null || text.trim().isEmpty()) {
            return null;
        }
        text = text.trim();
        if (!text.contains("T") && !text.contains(" ")) {
            return LocalDate.parse(text).atStartOfDay();
        }
        return LocalDateTime.parse(text.replace(" ", "T"));
    }
}
