package com.pujapath.service;

import com.pujapath.entity.Expense;
import com.pujapath.repository.ExpenseRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    public List<Expense> getExpensesForSquad(String squadId) {
        return expenseRepository.findBySquadIdOrderByTimestampDesc(squadId);
    }

    public Expense addExpense(Expense expense) {
        if (expense.getId() == null) {
            expense.setId("exp-" + UUID.randomUUID().toString().substring(0, 8));
        }
        if (expense.getTimestamp() == null) {
            expense.setTimestamp(System.currentTimeMillis());
        }
        return expenseRepository.save(expense);
    }

    public void deleteExpense(String id) {
        expenseRepository.deleteById(id);
    }
}
