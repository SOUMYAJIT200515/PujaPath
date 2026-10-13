package com.pujapath.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "expenses")
public class Expense {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, length = 64)
    private String squadId;

    @Column(nullable = false, length = 30)
    private String category; // metro_train, taxi_auto, food_bhog, pass_vip, emergency, other

    @Column(nullable = false, length = 200)
    private String description;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false, length = 64)
    private String paidByMemberId;

    @Column(nullable = false, length = 80)
    private String paidByName;

    @Column(nullable = false)
    private Long timestamp;

    public Expense() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getSquadId() { return squadId; }
    public void setSquadId(String squadId) { this.squadId = squadId; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getPaidByMemberId() { return paidByMemberId; }
    public void setPaidByMemberId(String paidByMemberId) { this.paidByMemberId = paidByMemberId; }

    public String getPaidByName() { return paidByName; }
    public void setPaidByName(String paidByName) { this.paidByName = paidByName; }

    public Long getTimestamp() { return timestamp; }
    public void setTimestamp(Long timestamp) { this.timestamp = timestamp; }
}
