select v.customerID, count(*) as countNoTrans
from visits v
left join transactions t on v.visitId = t.visitId
Where t.transactionId is null
GROUP BY v.customerID;