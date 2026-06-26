package com.aiemail.generator.template.service;

import com.aiemail.generator.template.dto.PromptLibraryCategory;
import com.aiemail.generator.template.dto.PromptLibraryItem;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class PromptLibraryServiceTest {

    /**
     * PromptLibraryService loads from classpath at startup via @PostConstruct.
     * We test its pure logic methods after manual initialization.
     */
    @Test
    void init_loadsLibraryFromClasspath() {
        PromptLibraryService service = new PromptLibraryService();
        service.init(); // Triggers @PostConstruct manually

        List<PromptLibraryItem> items = service.getLibrary();
        assertNotNull(items);
        assertFalse(items.isEmpty(), "Library should have loaded items from prompt-library.json");
    }

    @Test
    void getCategories_returnsDistinctCategories() {
        PromptLibraryService service = new PromptLibraryService();
        service.init();

        List<String> categories = service.getCategories();
        assertNotNull(categories);
        assertFalse(categories.isEmpty());
        // Verify no duplicates
        assertEquals(categories.stream().distinct().count(), categories.size());
    }

    @Test
    void getCategorizedLibrary_returnsGroupedItems() {
        PromptLibraryService service = new PromptLibraryService();
        service.init();

        List<PromptLibraryCategory> categorized = service.getCategorizedLibrary();
        assertNotNull(categorized);
        assertFalse(categorized.isEmpty());
        // Each category should have items
        categorized.forEach(cat -> {
            assertNotNull(cat.getName());
            assertFalse(cat.getItems().isEmpty());
        });
    }

    @Test
    void getItemById_found() {
        PromptLibraryService service = new PromptLibraryService();
        service.init();

        // Get the first item's id and look it up
        String firstId = service.getLibrary().get(0).getId();
        PromptLibraryItem item = service.getItemById(firstId);
        assertNotNull(item);
        assertEquals(firstId, item.getId());
    }

    @Test
    void getItemById_notFound_throwsException() {
        PromptLibraryService service = new PromptLibraryService();
        service.init();

        assertThrows(Exception.class, () -> service.getItemById("non-existent-id"));
    }
}
