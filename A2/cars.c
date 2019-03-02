#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include "traffic.h"

extern struct intersection isection;

/**
 * Populate the car lists by parsing a file where each line has
 * the following structure:
 *
 * <id> <in_direction> <out_direction>
 *
 * Each car is added to the list that corresponds with
 * its in_direction
 *
 * Note: this also updates 'inc' on each of the lanes
 */
void parse_schedule(char *file_name) {
    int id;
    struct car *cur_car;
    struct lane *cur_lane;
    enum direction in_dir, out_dir;
    FILE *f = fopen(file_name, "r");

    /* parse file */
    while (fscanf(f, "%d %d %d", &id, (int*)&in_dir, (int*)&out_dir) == 3) {

        /* construct car */
        cur_car = malloc(sizeof(struct car));
        cur_car->id = id;
        cur_car->in_dir = in_dir;
        cur_car->out_dir = out_dir;

        /* append new car to head of corresponding list */
        cur_lane = &isection.lanes[in_dir];
        cur_car->next = cur_lane->in_cars;
        cur_lane->in_cars = cur_car;
        cur_lane->inc++;
    }

    fclose(f);
}

/**
 * TODO: Fill in this function
 *
 * Do all of the work required to prepare the intersection
 * before any cars start coming
 *
 */
void init_intersection() {
    int i;
    // init isection
    for(i = 0; i < 4; i++){
        // init intersection main lock
        pthread_mutex_init(&(isection.quad[i]), NULL);

        // init each lane's lock
        pthread_mutex_init(&(isection.lanes[i].lock), NULL);
        pthread_cond_init(&(isection.lanes[i].producer_cv), NULL);
        pthread_cond_init(&(isection.lanes[i].consumer_cv), NULL);

        // init attributes
        isection.lanes[i].in_cars = NULL;
        isection.lanes[i].out_cars = NULL;
        isection.lanes[i].inc = 0;
        isection.lanes[i].passed = 0;
        // buffer represent the car lines and stores each cars info
        isection.lanes[i].buffer = (struct car **)malloc(LANE_LENGTH * sizeof(struct car*));
        isection.lanes[i].head = 0;
        isection.lanes[i].tail = 0;
        isection.lanes[i].capacity = LANE_LENGTH;
        isection.lanes[i].in_buf = 0;
    }



}

/**
 * TODO: Fill in this function
 *
 * Populates the corresponding lane with cars as room becomes
 * available. Ensure to notify the cross thread as new cars are
 * added to the lane.
 *
 */
void *car_arrive(void *arg) {
    struct lane *l = arg;

    /* avoid compiler warning */
    l = l;

    while(1){
        pthread_mutex_lock(&(l->lock));
        if(l->inc == 0){// no more cars can be passed
            pthread_mutex_lock(&(l->lock));
            break;
        }

        while(l->in_buf == l->capacity){// when buff is full
            pthread_cond_wait(&(l->consumer_cv), &(l->lock));// ask for cross thread
        }

        l->buffer[l->tail] = l->in_cars;// move first of cars to lane end
        l->tail = ((l->tail) + 1) % LANE_LENGTH;// update lane end
        l->in_cars = l->in_cars->next;// update the next car to be append
        l->in_buf++; // update current amt elements in lane

        pthread_cond_signal(&(l->producer_cv));// tell the cross thread
        pthread_mutex_unlock(&(l->lock));
    }

    return NULL;
}

/**
 * TODO: Fill in this function
 *
 * Moves cars from a single lane across the intersection. Cars
 * crossing the intersection must abide the rules of the road
 * and cross along the correct path. Ensure to notify the
 * arrival thread as room becomes available in the lane.
 *
 * Note: After crossing the intersection the car should be added
 * to the out_cars list of the lane that corresponds to the car's
 * out_dir. Do not free the cars!
 *
 *
 * Note: For testing purposes, each car which gets to cross the
 * intersection should print the following three numbers on a
 * new line, separated by spaces:
 *  - the car's 'in' direction, 'out' direction, and id.
 *
 * You may add other print statements, but in the end, please
 * make sure to clear any prints other than the one specified above,
 * before submitting your final code.
 */
void *car_cross(void *arg) {
    struct lane *l = arg;
    struct car *curr_car;
    int *paths;
    int i;
    struct lane *out_lane;

    /* avoid compiler warning */
    l = l;

    while(1){
        pthread_mutex_lock(&(l->lock));

        // when no car in both lane and buffer
        if(l->inc == 0 && l->in_buf == 0){
            pthread_mutex_unlock(&(l->lock));
            break;
        }

        while(l->in_buf == 0){// when no cars in buffer
            pthread_cond_wait(&(l->producer_cv), &(l->lock));// ask for arrive thread
        }

        curr_car = l->buffer[l->head];// take the first car from buffer
        l->head = ((l->head) + 1) % LANE_LENGTH;// update new head

        //check if the quadrant is avaliable. If it is, lock it
        paths = compute_path(curr_car->in_dir, curr_car->out_dir);
        for(i=0; i<4; i++){//check each quadrant
            if(paths[i] == 1){// if need the quadrant
                pthread_mutex_lock(&isection.quad[i]);
                // tell other lanes that I need this quadrant
            }
        }

        // update the lane that the car moves out
        out_lane = &(isection.lanes[curr_car->out_dir]);

        curr_car->next = out_lane->out_cars;
        out_lane->out_cars = curr_car;
        out_lane->passed++;


        (l->in_buf)--;

        for(i=0; i<4; i++){//unlock used quadrant for others
            if(paths[i] == 1){
                pthread_mutex_unlock(&isection.quad[i]);
            }
        }

        printf("%d %d %d\n", curr_car->in_dir, curr_car->out_dir, curr_car->id);

        free(paths);
        pthread_cond_signal(&(l->consumer_cv));// tell the arrive thread
        pthread_mutex_unlock(&(l->lock));
    }

    return NULL;
}

/**
 * TODO: Fill in this function
 *
 * Given a car's in_dir and out_dir return a sorted
 * list of the quadrants the car will pass through.
 *
 */
int *compute_path(enum direction in_dir, enum direction out_dir) {

    // init a list of quadrant used, 0 as donot need this quadrant, 1 as need
    int *need_quadrant = (int *)malloc(4 * sizeof(int));
    memset(need_quadrant, 0, 4 * sizeof(int));

    if(in_dir == out_dir){// U turn
        memset(need_quadrant, 1, 4 * sizeof(int));
    }else if((in_dir + 2) % 4 == out_dir){// go straight
        need_quadrant[in_dir] = 1;
        need_quadrant[out_dir] = 1;
    }else if((in_dir + 1) % 4 == out_dir){// go right
        need_quadrant[in_dir] = 1;
    }else if((in_dir + 3) % 4 == out_dir){// go left
        need_quadrant[in_dir] = 1;
        need_quadrant[(in_dir + 1) % 4] = 1;
        need_quadrant[(in_dir + 3) % 4] = 1;
    }

    return need_quadrant;
}
