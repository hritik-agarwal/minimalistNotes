import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import React, {useEffect, useState} from 'react';
import {styles} from './Expense.css';
import {hp, wp} from '../../utils/dimension';
import {useNavigation} from '@react-navigation/native';
import Button from '../../components/Button/Button';
import {useIsFocused} from '@react-navigation/native';

const Expense = props => {
  const navigation = useNavigation();
  const {id, category, expenseData, deleteExpense, saveExpense} = props;
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('');
  const [newCategory, setNewTitle] = useState(category);
  const [editMode, setEditMode] = useState(false);
  const [showConfirmDeletePopup, setShowConfirmDeletePopup] = useState(false);
  const [showNewExpensePopup, setShowNewExpensePopup] = useState(false);
  const [totalExpense, setTotalExpense] = useState(0);

  const getTodayDate = () => {
    return new Date().toLocaleDateString();
  };

  const clearState = () => {
    setTitle('');
    setAmount('');
    setMethod('');
    setShowNewExpensePopup(false);
  };

  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) return;
    let amountspent = 0;
    expenseData.forEach(item => (amountspent += item.amount));
    setTotalExpense(amountspent);
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('ExpenseScreen', {});
        }}
        onLongPress={() => setEditMode(true)}>
        {editMode === true ? (
          <TextInput
            maxLength={50}
            autoFocus={true}
            style={[styles.category]}
            value={newCategory}
            onChangeText={text => setNewTitle(text)}
          />
        ) : (
          <Text style={styles.category}>{category}</Text>
        )}
      </TouchableOpacity>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {editMode === true ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Button
              title={
                <Image
                  style={{width: wp(20), height: wp(20)}}
                  source={require('./../../src/images/icons/delete.png')}
                />
              }
              styleContainer={{backgroundColor: 'transparent'}}
              styleText={{color: 'black', marginTop: -10}}
              onPress={() => setShowConfirmDeletePopup(true)}
            />
            <Button
              title="Save"
              styleContainer={{backgroundColor: 'transparent'}}
              styleText={{color: 'black', fontSize: 18, paddingLeft: 0}}
              onPress={() => {
                if (category !== newCategory)
                  saveExpense(id, newCategory, expenseData);
                setEditMode(false);
              }}
            />
          </View>
        ) : (
          <View>
            <Text style={styles.amount}>Rs. {totalExpense}</Text>
          </View>
        )}
      </View>
      <Button
        title="+"
        styleContainer={{
          backgroundColor: 'transparent',
          width: wp('10%'),
          borderWidth: 1,
        }}
        styleText={{color: 'black'}}
        onPress={() => setShowNewExpensePopup(true)}
      />
      <Modal
        visible={showConfirmDeletePopup}
        onRequestClose={() => setShowConfirmDeletePopup(false)}
        transparent={true}
        animationType="fade">
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={() => setShowConfirmDeletePopup(false)}
        />
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Confirm Delete?</Text>
          <Button title="Yes" onPress={() => deleteExpense(id)} />
          <Button title="No" onPress={() => setShowConfirmDeletePopup(false)} />
        </View>
      </Modal>
      <Modal
        visible={showNewExpensePopup}
        onRequestClose={clearState}
        transparent={true}
        animationType="fade">
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={clearState}
        />
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Add new expense</Text>
          <View style={styles.modalItemContainer}>
            <Text style={styles.modalItemTitle}>Title:</Text>
            <TextInput
              value={title}
              style={styles.modalItemInput}
              onChangeText={text => setTitle(text)}
              placeholder="Where?"
              autoFocus={true}
            />
          </View>
          <View style={styles.modalItemContainer}>
            <Text style={styles.modalItemTitle}>Amount:</Text>
            <TextInput
              value={amount}
              keyboardType="numeric"
              style={styles.modalItemInput}
              onChangeText={text => setAmount(text)}
              placeholder="How much?"
            />
          </View>
          <View style={styles.modalItemContainer}>
            <Text style={styles.modalItemTitle}>Method:</Text>
            <TextInput
              value={method}
              style={styles.modalItemInput}
              onChangeText={text => setMethod(text)}
              placeholder="cash/bank?"
            />
          </View>
          <View style={styles.modalItemButtonContainer}>
            <Button
              title="Add"
              onPress={() => {
                if (title === '' || amount === '') {
                  alert('Please add correct details!');
                  return;
                }
                const values = amount.split(',');
                let total = 0;
                values.forEach(i => {
                  if (i.length) total += parseInt(i);
                });
                saveExpense(id, newCategory, [
                  ...expenseData,
                  {
                    title: title,
                    amount: total,
                    method: method === '' ? 'cash' : method,
                    date: new Date(),
                  },
                ]);
                clearState();
                setTotalExpense(prev => parseInt(prev) + parseInt(total));
              }}
              styleContainer={styles.modalItemButton}
            />
            <Button
              title="Cancel"
              onPress={() => {
                setShowNewExpensePopup(false);
                clearState();
              }}
              styleContainer={styles.modalItemButton}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Expense;
