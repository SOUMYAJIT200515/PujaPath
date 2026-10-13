package com.pujapath.controller;

import com.pujapath.entity.Expense;
import com.pujapath.service.ExpenseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groups/{groupId}/expenses")
@CrossOrigin(origins = "*")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @GetMapping
    public ResponseEntity<List<Expense>> getExpenses(@PathVariable String groupId) {
        return ResponseEntity.ok(expenseService.getExpensesForSquad(groupId));
    }

    @PostMapping
    public ResponseEntity<Expense> addExpense(@PathVariable String groupId,
                                              @RequestBody Expense expense) {
        expense.setSquadId(groupId);
        Expense saved = expenseService.addExpense(expense);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable String groupId,
                                              @PathVariable String id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.noContent().build();
    }
}
